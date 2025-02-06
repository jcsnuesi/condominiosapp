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
import { CommonModule } from '@angular/common';
import { FamilyMemberComponent } from '../family-member/family-member.component';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TabView } from 'primeng/tabview';
import { MessageService } from 'primeng/api';

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
    providers: [MessageService],
    templateUrl: './family-area.component.html',
    styleUrl: './family-area.component.scss',
})
export class FamilyAreaComponent implements AfterViewInit {
    public urlId: string;
    public photos: any;
    activeIndex: number = 0;
    @ViewChild('tabViewController') memberTabEvent!: TabView;
    @ViewChild(FamilyMemberDetailsComponent)
    familyMemberD!: FamilyMemberDetailsComponent;
    @ViewChild('familyMemberDetails') familyMemberDetailsView!: TabView;
    @Input() memberInfoFromDetails: { show: boolean; data: any };
    @ViewChild('tabContainer', { read: ElementRef }) tabContainer!: ElementRef;

    constructor(
        private cdr: ChangeDetectorRef,
        private _messageService: MessageService
    ) {
        this.memberInfoFromDetails = { show: false, data: {} };
    }

    messageEvent(event: string) {
        console.log('Evento recibido: ', event);
        this.familyMemberD.ngOnInit();
    }

    memberInfoFromDetailsEvent(event: any) {
        this.memberInfoFromDetails = { ...event };
        this.memberInfoFromDetails.show = true;
        this.setTabViewIndex(2);
    }
    onTabChange(event: any) {
        console.log('Tab changed to:', event.index);
        if (event.index !== 2) {
            this.memberInfoFromDetails = { show: false, data: {} };
            this.activeIndex = event.index;
            this.cdr.detectChanges();
        } else {
            this.activeIndex = event.index;
            this.cdr.detectChanges();
        }
    }

    setTabViewIndex(index: number) {
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
                console.log(`Cambiando a tab: ${index}`);
                this.memberTabEvent.activeIndex = index;
                this.onTabChange({ index });
                this.cdr.detectChanges();
            } else {
                console.warn(
                    'TabView aún no está listo. Intentando nuevamente...'
                );
                setTimeout(() => this.setTabViewIndex(index), 50); // Reintentar si aún no está listo
            }
        }, 0);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.memberTabEvent) {
                console.log('TabView está listo.');
                // Remueve el foco
                this.cdr.detectChanges(); // Aseguramos que Angular lo detecte
            } else {
                console.warn('TabView aún no está disponible, reintentando...');
                setTimeout(() => this.ngAfterViewInit(), 50); // Reintentamos si aún no está listo
            }
        });
    }
}
