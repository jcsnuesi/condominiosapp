import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';
import { UserService } from '../../service/user.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    providers: [MessageService, UserService],
})
export class RegisterComponent {
    model: any[] = [];
    genero: any[] = [
        { name: 'F', code: 'F' },
        { name: 'M', code: 'M' },
    ];

    public status: string;
    public preview: boolean;
    public image: string;
    public token: string;
    public userImage: any[] = [];

    selectedState: any = null;

    states_us: any[] = [
        { name: 'Arizona', code: 'Arizona' },
        { name: 'California', value: 'California' },
        { name: 'Florida', code: 'Florida' },
        { name: 'Ohio', code: 'Ohio' },
        { name: 'Washington', code: 'Washington' },
    ];

    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' },
    ];

    cities1: any[] = [];

    cities2: any[] = [];

    city1: any = null;

    city2: any = null;

    public checked: boolean;
    public user: User;
    public messages = [{ severity: '', summary: '', details: '' }];

    constructor(
        private messageService: MessageService,
        private _userService: UserService
    ) {
        this.user = new User(
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            false,
            false
        );
        this.user.country = 'Republica Dominicana';
        this.preview = false;
        this.checked = false;
        this.token = this._userService.getToken();
    }
    onSelect(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;

            this.image = base64Data;
            this.status = 'true';
            this.preview = true;

            setTimeout(() => {
                this.status = 'false';
            }, 3000);
        };

        reader.readAsDataURL(file.files[0]);
        this.userImage.push(file.files[0]);

        this.messages[0].severity = 'success';
        this.messages[0].summary = 'Image uploaded successfully!';
        this.messages[0].details = 'Upload!';
    }

    onSubmit(form: any) {
        if (this.checked) {
            const formData = new FormData();

            if (this.userImage.length > 1) {
                this.userImage.forEach((img) => {
                    formData.append('avatar', img, img.name);
                });
            }

            for (const key in this.user) {
                formData.append(key, this.user[key]);
            }

            this._userService.create(formData, this.token).subscribe(
                (response) => {
                    if (response.status == 'success') {
                        this.status = response.status;

                        this.messages[0].severity = 'success';
                        this.messages[0].summary = 'Account created!';
                        this.messages[0].details = 'created';
                    } else {
                        this.messages[0].severity = 'error';
                        this.messages[0].summary = 'Account was not created';
                        this.messages[0].details = 'Error';
                    }

                    console.log(response);
                },
                (error) => {
                    this.messages[0].severity = error.status;
                    this.messages[0].summary = error.message;
                    this.messages[0].details = 'Error';
                    console.log(error);
                }
            );
        }
    }

    termSelection(event: any, form: NgForm) {
        const isChecked = form.value.terms;

        if (isChecked && form.valid) {
            this.user.terms = true;
            this.setformValid(true);
        } else {
            this.setformValid(false);
        }
    }

    getformValid() {
        return this.checked;
    }

    setformValid(formStatus: boolean) {
        this.checked = formStatus;
    }
}
