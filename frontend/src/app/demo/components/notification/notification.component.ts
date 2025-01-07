import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [FormsModule, CommonModule, MenuModule, ButtonModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        console.log('NotificationComponent');
    }
}
