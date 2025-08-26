import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { CondominioService } from '../../service/condominios.service';

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss'],
    standalone: true,
    imports: [
        DataViewModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        TagModule,
    ],
    providers: [UserService, CondominioService],
})
export class PropertiesComponent implements OnInit {
    public products: any[];

    public token: string =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzNTU4MjY4fQ._qyJtXv90tZG_Cvx45xAErAW0371NN09_YxCDD8GJFg';

    public layout: string = 'list';
    public identity: any;
    public url: any;

    constructor(
        private _userService: UserService,
        private _condominioService: CondominioService,
        private _router: Router
    ) {
        this.url = global.url;
        this.identity = this._userService.getIdentity();
    }

    ngOnInit(): void {
        this.getCondominios();
    }

    setToUpperCase(data) {
        return data.toUpperCase();
    }

    getId(): string {
        return this.identity.role.toLowerCase() == 'admin'
            ? this.identity._id
            : this.identity.createdBy;
    }

    getCondominios() {
        this._condominioService
            .getPropertyByIdentifier(this.token, this.getId())
            .subscribe(
                (response) => {
                    this.products = response.message;
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    units(id: string) {
        console.log(id);
        this._router.navigate(['customers/units/', id]);
    }
}
