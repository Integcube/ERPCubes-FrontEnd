import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletedItems } from './trash.type';

@Injectable({
    providedIn: 'root'
})
export class TrashService {
    private readonly getDeletedLeadListUrl = `${environment.url}/Lead/allDeleted`
    private readonly restoreLeadUrl = `${environment.url}/Lead/restore`
    private readonly restoreBulkLeadUrl = `${environment.url}/Lead/restoreBulkLead`

    private readonly getDeletedCompanyListUrl = `${environment.url}/Company/del`
    private readonly restoreBulkCompanyUrl = `${environment.url}/Company/restoreBulk`
    private readonly restoreCompanyUrl = `${environment.url}/Company/restore`

    private readonly getDeletedOpportunityListUrl = `${environment.url}/Opportunity/allDeleted`
    private readonly restoreBulkOpportunityUrl = `${environment.url}/Opportunity/restoreBulk`
    private readonly restoreOpportunityUrl = `${environment.url}/Opportunity/restore`

    private readonly getDeletedProductListUrl = `${environment.url}/Product/del`
    private readonly restoreBulkProductUrl = `${environment.url}/Product/restoreBulk`
    private readonly restoreProductUrl = `${environment.url}/Product/restore`
    
    private readonly getDeletedUsersUrl = `${environment.url}/Users/del`
    private readonly restoreUserListUrl = `${environment.url}/Users/restore`
    private readonly restoreBulkUserUrl = `${environment.url}/Users/restoreBulkUser`
    
    private readonly getDeletedNoteListUrl = `${environment.url}/Notes/del`
    private readonly restoreNoteUrl = `${environment.url}/Notes/restore`
    private readonly restoreBulkNoteUrl = `${environment.url}/Notes/restoreBulk`
    
    private readonly getDeletedTaskListUrl = `${environment.url}/Task/del`
    private readonly restoreTaskUrl = `${environment.url}/Task/restore`
    private readonly restoreBulkTaskUrl = `${environment.url}/Task/restoreBulk`
    
    private readonly getDeletedTeamListUrl = `${environment.url}/Team/del`
    private readonly restoreTeamkUrl = `${environment.url}/Team/restore`
    private readonly restoreBulkTeamUrl = `${environment.url}/Team/restoreBulk`
    
    private readonly getDeletedCampaignListUrl = `${environment.url}/Campaign/del`
    private readonly restoreCampaignkUrl = `${environment.url}/Campaign/restore`
    private readonly restoreBulkCampaignUrl = `${environment.url}/Campaign/restoreBulkCampaign`
    
    private readonly getDeletedFormListUrl = `${environment.url}/Forms/del`
    private readonly restoreFormUrl = `${environment.url}/Forms/restore`
    private readonly restoreBulkFormUrl = `${environment.url}/Forms/restoreBulk`
    
    private readonly getDeletedProjectListUrl = `${environment.url}/Project/del`
    private readonly restoreProjectUrl = `${environment.url}/Project/restore`
    private readonly restoreBulkProjectUrl = `${environment.url}/Project/restoreBulk`

    user: User;
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
        private snackBar: MatSnackBar)
    {
        this._userService.user$.subscribe(user => { this.user = user; })
    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this.snackBar.open(text, "", {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName,
        });
    }

    getDeletedLeads(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedLeadListUrl, data).pipe(
       
            
        );
    }
    restoreLead(lead: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            leadId: lead.id
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreLeadUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Lead restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkLeads(leadIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            leadId: leadIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkLeadUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Leads restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedCompany(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedCompanyListUrl, data).pipe(
       
            
        );
    }
    restoreCompany(company: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            companyId: company.id
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreCompanyUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Company restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkCompany(companyIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            companyId: companyIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkCompanyUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Companys restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedOpportunity(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        debugger;
        return this._httpClient.post<DeletedItems[]>(this.getDeletedOpportunityListUrl, data).pipe(
        );
    }
    restoreOpportunity(opportunity: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            opportunityId: opportunity.id
        };
        debugger;
        return this._httpClient.post<DeletedItems[]>(this.restoreOpportunityUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Opportunity restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkOpportunity(opportunityIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            opportunityId: opportunityIds
        };
        debugger;
        return this._httpClient.post<DeletedItems[]>(this.restoreBulkOpportunityUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Opportunitys restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedProducts(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedProductListUrl, data).pipe(
            
        );
    }
    restoreProduct(product: DeletedItems): Observable<DeletedItems> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            productId: product.id
        };
        return this._httpClient.post<DeletedItems>(this.restoreProductUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Product restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkProduct(productIds: number[]): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            productId: productIds
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreBulkProductUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
            }),
            
        );
    }

    getDeletedUsersList(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedUsersUrl, data).pipe(
         
            
        );
    }
    restoreUser(user: DeletedItems): Observable<DeletedItems> {
        let data = {
            id: this.user.id,
            user: {
                id: user.id,
                tenantId: this.user.tenantId
              }
        };
        return this._httpClient.post<DeletedItems>(this.restoreUserListUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'User restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkUsers(user: number[]): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            user:{
                tenantId: this.user.tenantId,
                id: user
            }
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreBulkUserUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Users restored successfully', 'bottom', 'center');
            }),
            
        );
    }

    getDeletedNotes(): Observable<DeletedItems[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedNoteListUrl, data).pipe(
       
            
        );
    }
    restoreNote(note: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            noteId: note.id
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreNoteUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Note restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkNotes(noteIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            noteId: noteIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkNoteUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Notes restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedTask(): Observable<DeletedItems[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedTaskListUrl, data).pipe(
       
            
        );
    }
    restoreTask(task: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            taskId: task.id
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreTaskUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Task restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkTasks(taskIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            taskId: taskIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkTaskUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Tasks restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedTeam(): Observable<DeletedItems[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedTeamListUrl, data).pipe(
       
            
        );
    }
    restoreTeam(team: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            teamId: team.id
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreTeamkUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Team restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkTeam(teamIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            teamId: teamIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkTeamUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Teams restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedCampaign(): Observable<DeletedItems[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedCampaignListUrl, data).pipe(
       
            
        );
    }
    restoreCampaign(campaign: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            campaignId: campaign.id
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreCampaignkUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Campaign restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkCampaign(campaignIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            campaignId: campaignIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkCampaignUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Campaigns restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedForm(): Observable<DeletedItems[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedFormListUrl, data).pipe(
       
            
        );
    }
    restoreForm(form: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            formId: form.id
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreFormUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Campaign restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkForm(formIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            formId: formIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkFormUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Campaigns restored successfully', 'bottom', 'center');

            }),
            
        );
    }

    getDeletedProject(): Observable<DeletedItems[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedProjectListUrl, data).pipe(
       
            
        );
    }
    restoreProject(project: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            projectId: project.id
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreProjectUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Project restored successfully', 'bottom', 'center');
            }),
            
        );
    }
    restoreBulkProject(projectIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            projectId: projectIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkProjectUrl, data).pipe(
            tap(() => {
                // this.showNotification('snackbar-success', 'Projects restored successfully', 'bottom', 'center');

            }),
            
        );
    }

}
