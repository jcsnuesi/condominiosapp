import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../api/image';
import { Observable } from 'rxjs';

@Injectable()
export class PhotoService {
    constructor(private http: HttpClient) {}

    getImages(): Observable<any> {
        return this.http.get<any>('assets/demo/data/photos.json');
    }
}
