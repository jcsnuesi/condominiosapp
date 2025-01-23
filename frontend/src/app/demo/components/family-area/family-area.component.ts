import {
    Component,
    input,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyMemberComponent } from '../family-member/family-member.component';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TabView } from 'primeng/tabview';

@Component({
    selector: 'app-family-area',
    standalone: true,
    imports: [
        FamilyMemberComponent,
        FamilyMemberDetailsComponent,
        TabViewModule,
        TagModule,
        ToastModule,
        CommonModule,
    ],
    templateUrl: './family-area.component.html',
    styleUrl: './family-area.component.scss',
})
export class FamilyAreaComponent {
    public urlId: string;
    public photos: any;
    @ViewChild('tabViewController') memberTabEvent: TabView;
    // public memberInfoFromDetails: any;
    @Input() memberInfoFromDetails: { show: boolean; data: any };
    constructor() {
        this.memberInfoFromDetails = { show: false, data: {} };
    }

    memberInfoFromDetailsEvent(event: any) {
        this.memberInfoFromDetails = event;
        this.memberTabEvent.activeIndex = 2;
        console.log('CLICKED', this.memberTabEvent);
    }
}
