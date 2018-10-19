import { Injectable, isDevMode } from '@angular/core';

import * as _ from 'lodash';

type loglevels = 'debug' | 'info' | 'warn' | 'error';
type loglabels = 'Debug' | 'Info' | 'Warning' | 'Error';
interface LogLevel {
    level: loglevels;
    weight: number;
    default?: boolean;
    label: loglabels;
}

@Injectable()
export class LoggerService {
    /* tslint:disable */
    public levels: any;
    public weight: any;
    public logs: any[];
    public filters: loglevels[] = [];
    public filterTexts: string[] = [];
    constructor() {
        this.logs = [];
        this.levels = <LogLevel[]>[
            { level: 'error', weight: 1, label: 'Error' },
            { level: 'warn', weight: 2, label: 'Warning' },
            { level: 'info', weight: 3, label: 'Info', default: true },
            { level: 'debug', weight: 4, label: 'Debug' }
        ];

        // Create an array of level weights for performant filtering.
        this.weight = {};
        for (let i = 0; i < this.levels.length; i++) {
            this.weight[this.levels[i].level] = this.levels[i].weight;
        }

        this.addFilterText('refresh wallets');
    }

    public addFilterLevels(level: loglevels) {
        const index = this.filters.indexOf(level);
        if (index < 0) {
            this.filters.push(level);
        }
    }

    public removeFilterLevels(level: loglevels) {
        const index = this.filters.indexOf(level);
        if (index > -1) {
            this.filters.slice(index);
        }
    }

    public addFilterText(text: string) {
        this.filterTexts.push(text);
    }

    private isFilteredLevel(level: loglevels): boolean {
        return this.filters.indexOf(level) !== -1;
    }

    private isFilteredText(text: string): boolean {
        if (typeof text === 'object') {
            return false;
        }

        return this.filterTexts.some(filteredText => {
            return text.includes(filteredText);
        });
    }

    private timeStamp(log: string): string {
        const date = new Date();

        return (
            `[${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}|` +
            `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:` +
            `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:` +
            `${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}:` +
            `${date.getMilliseconds() < 100 ? `0${date.getMilliseconds()}` : date.getMilliseconds()}] ${log}`
        );
    }

    public error(message?: any, ...optionalParams: any[]): void {
        let msg = this.timeStamp(`[error] ${_.isString(message) ? message : JSON.stringify(message)}`);
        if (isDevMode() && !this.isFilteredLevel('error') && !this.isFilteredText(message)) console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('error', args);
    }

    public debug(message?: any, ...optionalParams: any[]): void {
        let msg = this.timeStamp(`[debug] ${_.isString(message) ? message : JSON.stringify(message)}`);
        if (isDevMode() && !this.isFilteredLevel('debug') && !this.isFilteredText(message)) console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('debug', args);
    }

    public info(message?: any, ...optionalParams: any[]): void {
        let msg = this.timeStamp(`[info] ${_.isString(message) ? message : JSON.stringify(message)}`);
        if (isDevMode() && !this.isFilteredLevel('info') && !this.isFilteredText(message)) console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('info', args);
    }

    public warn(message?: any, ...optionalParams: any[]): void {
        let msg = this.timeStamp(`[warn] ${_.isString(message) ? message : JSON.stringify(message)}`);
        if (isDevMode() && !this.isFilteredLevel('warn') && !this.isFilteredText(message)) console.log(msg, ...optionalParams);
        let args = this.processingArgs(arguments);
        this.add('warn', args);
    }

    public getLevels(): any {
        return this.levels;
    }

    public getWeight(weight): any {
        return _.find(this.levels, l => {
            return l.weight == weight;
        });
    }

    public getDefaultWeight(): any {
        return _.find(this.levels, l => {
            return l.default;
        });
    }

    public add(level, msg): any {
        msg = msg.replace('/xpriv.*/', '[...]');
        msg = msg.replace('/walletPrivKey.*/', 'walletPrivKey:[...]');
        this.logs.push({
            timestamp: new Date().toISOString(),
            level,
            msg
        });
    }

    /**
     * Returns logs of <= to filteredWeight
     * @param {number} filteredWeight Weight (1-4) to use when filtering logs. optional
     */
    public get(filterWeight?: number): any {
        let filteredLogs = this.logs;
        if (filterWeight != undefined) {
            filteredLogs = _.filter(this.logs, l => {
                return this.weight[l.level] <= filterWeight;
            });
        }
        return filteredLogs;
    }

    public processingArgs(argsValues: any) {
        var args = Array.prototype.slice.call(argsValues);
        args = args.map(v => {
            try {
                if (typeof v == 'undefined') v = 'undefined';
                if (!v) v = 'null';
                if (typeof v == 'object') {
                    v = v.message ? v.message : JSON.stringify(v);
                }
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.log('Error at log decorator:', e);
                v = 'undefined';
            }
            return v;
        });
        return args.join(' ');
    }
}
