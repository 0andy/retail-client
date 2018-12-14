import { Injectable } from '@angular/core';
import { ResultDto, ShopUser, PagedResultDto, ResultEntity } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';

@Injectable()
export class PullService {

    constructor(private nodeComService: NodeCommonService, 
        private sqlite3Service: Sqlite3Service, 
        private nodeHttpClient: NodeHttpClient, 
        private settingsService: SettingsService) {
    }

    
}


