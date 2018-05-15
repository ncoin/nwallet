import { NgModule } from "@angular/core";
import { Logger } from "./logger/logger";
import { AppProvider } from "./app/app";

@NgModule({
    providers: [
        Logger,
        AppProvider
    ]
})
export class ProvidersModule{}
