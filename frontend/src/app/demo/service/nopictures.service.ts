import { Injectable } from '@angular/core';

@Injectable()
export class NoPicturesService {
    private noPictures: string = 'assets/noimage.jpeg';

    getNoPictures(img): string {
        if (
            img === null ||
            img === undefined ||
            img === '' ||
            !this.validateExtension(img)
        ) {
            return this.noPictures;
        }
        return img;
    }

    validateExtension(img: string): boolean {
        if (!img.includes('.')) {
            return false;
        }

        try {
            var validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            var extension = img.split('.').pop()?.toLowerCase();
        } catch (error) {
            return false;
        }
        return validExtensions.includes(extension);
    }
}
