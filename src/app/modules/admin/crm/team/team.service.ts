import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Team, TeamMembers } from './team.type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly getTeamListURL = `${environment.url}/Team/Get`
  private readonly saveTeamURL = `${environment.url}/Team/Save`
  private readonly deleteTeamURL = `${environment.url}/Team/Delete`
  private readonly getEmployeeListURL = `${environment.url}/Users/all`

  private _team: BehaviorSubject<Team | null> = new BehaviorSubject(null);
  private _teams: BehaviorSubject<Team[] | null> = new BehaviorSubject(null);
  private _employees: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

  user: User;

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar)
  {
    this._userService.user$.subscribe(user => { this.user = user; })
  }
  get team$(): Observable<Team> {
    return this._team.asObservable();
  }
  get teams$(): Observable<Team[]> {
    return this._teams.asObservable();
  }
  get employees$(): Observable<User[]> {
    return this._employees.asObservable();
  }
  getTeams(): Observable<Team[]> {
    let data = {
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Team[]>(this.getTeamListURL, data).pipe(
      tap((teams) => {
        this._teams.next(teams);
      }),
      catchError(err => this.handleError(err))
    );
  }
  getEmployeeList(): Observable<User[]> {
    let data = {
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<User[]>(this.getEmployeeListURL, data).pipe(
      tap((employees) => {
        this._employees.next(employees);
      }),
      catchError(err => this.handleError(err))
    );
  }
  saveTeam(team: any): Observable<Team[]> {
    let data = {
      tenantId: this.user.tenantId,
      userId: this.user.id,
      teamId: team.teamId,
      teamName: team.teamName,
      teamLeader: team.teamLeader,
      teamMembersId: team.teamMembersId.join(','),
    }
    return this._httpClient.post<Team[]>(this.saveTeamURL, data).pipe(
      tap((teams) => {
        this.getTeams().subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }
  deleteTeam(team: Team): Observable<Team[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      teamId: team.teamId,

    }
    debugger;
    return this._httpClient.post<Team[]>(this.deleteTeamURL, data).pipe(
      tap(() => {
        this.getTeams().subscribe();
      }),
      catchError(err => this.handleError(err))
    );
  }
  selectedTeam(selectedteam: Team) {
    this._team.next(selectedteam);
  }
  getTeamById(id: number): Observable<Team> {
    return this._teams.pipe(
      take(1),
      map((teams) => {
        if (id === -1) {
          const team = new Team({});
          this._team.next(team);

          return team;
        }
        else {
          const team = teams.find(item => item.teamId === id) || null;
          this._team.next(team);

          return team;
        }
      }),
      switchMap((team) => {
        if (!team) {
          return throwError('Could not find team with id of ' + id + '!');
        }
        return of(team);
      })
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
    return throwError(() => errorMessage);
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
