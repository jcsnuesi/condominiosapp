export interface LiveConnection { stream: MediaStream; close(): Promise<void>; }

export function iceServersFromLink(header: string | null): RTCIceServer[] {
  if (!header) return [];
  if (header.length > 8192) throw new Error('La configuración de conexión es demasiado grande.');
  const servers: RTCIceServer[] = [];
  for (const link of header.split(/,(?=\s*<)/)) {
    if (!/;\s*rel="ice-server"/.test(link)) continue;
    const address = link.match(/^\s*<([^>]+)>/)?.[1];
    if (!address || !/^(?:stun|stuns|turn|turns):[^\s<>]+$/.test(address)) throw new Error('La configuración de conexión no es válida.');
    const parameter = (name: string): string | undefined => {
      const value = link.match(new RegExp(`;\\s*${name}=("(?:[^"\\\\]|\\\\.)*")`))?.[1];
      return value ? JSON.parse(value) as string : undefined;
    };
    servers.push({ urls: address, username: parameter('username'), credential: parameter('credential') });
    if (servers.length > 8) throw new Error('Hay demasiados servidores de conexión.');
  }
  return servers;
}

// Direct signaling to the configured media gateway; login credentials never leave the app API.
export async function connectWhep(url: string, token: string, signal: AbortSignal): Promise<LiveConnection> {
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || !endpoint.pathname.endsWith('/whep'))
    throw new Error('La dirección de video no está configurada correctamente.');
  const peer = new RTCPeerConnection();
  const stream = new MediaStream();
  let resource: URL | null = null;
  const headers = { Authorization: `Bearer ${token}` };
  const close = async (): Promise<void> => {
    peer.close();
    stream.getTracks().forEach((track) => track.stop());
    if (resource) {
      const target = resource; resource = null;
      await fetch(target, { method: 'DELETE', headers: { ...headers, 'If-Match': '*' },
        signal: AbortSignal.timeout(3000), credentials: 'omit', redirect: 'error' }).catch(() => undefined);
    }
  };
  try {
    if (signal.aborted) throw new Error('Conexión cancelada.');
    const options = await fetch(endpoint, { method: 'OPTIONS', headers, signal, credentials: 'omit', redirect: 'error' });
    if (!options.ok) throw new Error('El gateway no permite iniciar la conexión de video.');
    peer.setConfiguration({ iceServers: iceServersFromLink(options.headers.get('Link')) });
    peer.ontrack = ({ track }) => { stream.addTrack(track); };
    peer.addTransceiver('video', { direction: 'recvonly' });
    peer.addTransceiver('audio', { direction: 'recvonly' });
    await peer.setLocalDescription(await peer.createOffer());
    await new Promise<void>((resolve, reject) => {
      const finish = (failure?: Error): void => {
        clearTimeout(timeout); peer.removeEventListener('icegatheringstatechange', gathering);
        signal.removeEventListener('abort', aborted);
        failure ? reject(failure) : resolve();
      };
      const gathering = (): void => { if (peer.iceGatheringState === 'complete') finish(); };
      const aborted = (): void => finish(new Error('Conexión cancelada.'));
      const timeout = setTimeout(() => finish(new Error('No se pudo preparar la conexión de video.')), 8000);
      peer.addEventListener('icegatheringstatechange', gathering);
      signal.addEventListener('abort', aborted, { once: true });
      if (signal.aborted) aborted(); else gathering();
    });
    const response = await fetch(endpoint, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/sdp' },
      body: peer.localDescription?.sdp, signal, credentials: 'omit', redirect: 'error' });
    if (response.status !== 201) throw new Error(response.status === 401 || response.status === 403
      ? 'El permiso de video expiró. Abre de nuevo la cámara.' : 'La cámara no está disponible. Revisa su conexión.');
    const location = response.headers.get('Location');
    if (location) {
      const candidate = new URL(location, endpoint);
      if (candidate.origin !== endpoint.origin || !candidate.pathname.startsWith(`${endpoint.pathname}/`) || candidate.username || candidate.password)
        throw new Error('La sesión de video devolvió una dirección no válida.');
      resource = candidate;
    }
    const answer = await response.text();
    if (answer.length > 65536) throw new Error('La respuesta de video no es válida.');
    await peer.setRemoteDescription({ type: 'answer', sdp: answer });
    await new Promise<void>((resolve, reject) => {
      const finish = (failure?: Error): void => {
        clearTimeout(timeout); peer.removeEventListener('connectionstatechange', changed);
        signal.removeEventListener('abort', aborted); failure ? reject(failure) : resolve();
      };
      const changed = (): void => {
        if (peer.connectionState === 'connected') finish();
        else if (['failed', 'closed'].includes(peer.connectionState)) finish(new Error('No se pudo conectar el video.'));
      };
      const aborted = (): void => finish(new Error('Conexión cancelada.'));
      const timeout = setTimeout(() => finish(new Error('La red no permite conectar el video. Revisa el gateway.')), 15000);
      peer.addEventListener('connectionstatechange', changed); signal.addEventListener('abort', aborted, { once: true });
      if (signal.aborted) aborted(); else changed();
    });
    return { stream, close };
  } catch (failure) { await close(); throw failure; }
}
