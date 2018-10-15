import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NotificationService {
    constructor(private http:HttpClient)  {

    }

    private async init(): Promise<void> {

    }
}
