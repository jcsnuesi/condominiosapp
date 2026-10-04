import {
    Component,
    input,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    viewChild,
    ChangeDetectorRef,
    AfterViewInit,
    ElementRef,
} from '@angular/core';

import { FamilyMemberComponent } from '../family-member/family-member.component';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Tabs } from 'primeng/tabs';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-family-area',
    imports: [
    FamilyMemberComponent,
    FamilyMemberDetailsComponent,
    TabsModule,
    TagModule,
    ToastModule
],
    providers: [MessageService],
    templateUrl: './family-area.component.html',
    styleUrl: './family-area.component.scss'
})
export class FamilyAreaComponent implements AfterViewInit {
    public urlId: string;
    public photos: any;
    activeIndex: number = 0;
    @ViewChild('tabViewController') memberTabEvent!: Tabs;
    @ViewChild(FamilyMemberDetailsComponent)
    familyMemberD!: FamilyMemberDetailsComponent;
    @ViewChild('familyMemberDetails') familyMemberDetailsView!: Tabs;
    @Input() memberInfoFromDetails: { show: boolean; data: any };
    @ViewChild('tabContainer', { read: ElementRef }) tabContainer!: ElementRef;

    constructor(
        private cdr: ChangeDetectorRef,
        private _messageService: MessageService
    ) {
        this.memberInfoFromDetails = { show: false, data: {} };
    }

    messageEvent() {
        this.familyMemberD?.getFamilyMemberDetails();
    }

    memberInfoFromDetailsEvent(event: any) {
        this.memberInfoFromDetails = { ...event };
        this.memberInfoFromDetails.show = true;
        this.setTabsIndex(2);
    }
    onTabChange(event: any) {
        // console.log('Tab changed to:', event.index);
        if (event.index !== 2) {
            this.memberInfoFromDetails = { show: false, data: {} };
            this.activeIndex = event.index;
            this.cdr.detectChanges();
        } else {
            this.activeIndex = event.index;
            this.cdr.detectChanges();
        }
    }

    setTabsIndex(index: number) {
        setTimeout(() => {
            if (this.memberTabEvent && this.memberInfoFromDetails.show) {
                if (this.tabContainer) {
                    const focusableElements =
                        this.tabContainer.nativeElement.querySelectorAll(
                            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                        );
                    this.tabContainer.nativeElement.blur(); // Enfoca el contenedor
                    if (focusableElements.length > 0) {
                        (focusableElements[0] as HTMLElement).blur(); // Remueve el foco
                    }
                }
                // console.log(`Cambiando a tab: ${index}`);
                this.activeIndex = index;
                this.onTabChange({ index });
                this.cdr.detectChanges();
            } else {
                this.activeIndex = index;
            }
        }, 0);
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }
}
