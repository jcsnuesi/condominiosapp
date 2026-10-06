import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SupportCallService } from '../../services/support-call.service';
import { UserService } from '../../demo/service/user.service';

@Component({
  selector: 'app-support-call',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './support-call.component.html',
  styleUrl: './support-call.component.css',
})
export class SupportCallComponent implements OnInit, OnDestroy {
  readonly calls = inject(SupportCallService);
  private readonly users = inject(UserService);
  readonly open = signal(false);
  ngOnInit(): void { this.calls.connect(this.users.getIdentity()?.role || ''); }
  ngOnDestroy(): void { this.calls.stop(); }
}
