import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessContextService } from '../demo/service/access-context.service';
import { global } from '../demo/service/global.service';
interface Notice { _id: string; title: string; body: string; }
@Component({ standalone: true, selector: 'app-platform-announcements', template: `@for (notice of notices(); track notice._id) { <aside role="status" class="platform-notice"><strong>{{ notice.title }}</strong><p>{{ notice.body }}</p></aside> }`, styles: [`.platform-notice { padding: 1rem; margin: .75rem 0; border: 1px solid var(--surface-border); border-radius: .5rem; background: var(--surface-card); }`] })
export class PlatformAnnouncementsComponent {
  readonly notices = signal<Notice[]>([]);
  constructor() { if (!inject(AccessContextService).access()?.isPlatform) inject(HttpClient).get<{ data: Notice[] }>(`${global.url}platform-announcements`).subscribe({ next: result => this.notices.set(result.data), error: () => {} }); }
}
