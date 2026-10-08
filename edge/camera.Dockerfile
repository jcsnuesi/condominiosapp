FROM node:22.18.0-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY edge/gateway-agent ./edge/gateway-agent
COPY edge/adapters/camera ./edge/adapters/camera
COPY edge/mediamtx ./edge/mediamtx
USER node
CMD ["node", "edge/adapters/camera/agent.js", "--config", "/run/secrets/camera-agent.json"]
