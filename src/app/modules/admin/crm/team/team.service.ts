import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Team, TeamMembers } from './team.type';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { FormGroup } from '@angular/forms';

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
    private _httpClient: HttpClient,) {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
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
      })
    );
  }
  getEmployeeList(): Observable<User[]> {
    let data = {
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<User[]>(this.getEmployeeListURL, data).pipe(
      tap((employees) => {
        this._employees.next(employees);
      })
    );
  }
  saveTeam(team: any): Observable<Team[]> {
    let data: Team = {
      tenantId: this.user.tenantId,
      userId: this.user.id,
      ...team,
      teamId: team.teamId,
      teamName: team.teamName,
      teamLeader: team.teamLeaderId,
      teamMembersId: team.teamMembersId.join(','),
    }
    return this._httpClient.post<Team[]>(this.saveTeamURL, data).pipe(
      tap((teams) => {
        this.getTeams().subscribe();
      })
    );
  }
  deleteTeam(team: Team): Observable<Team[]> {
    let data = {
      teamId: team.teamId,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Team[]>(this.deleteTeamURL, data).pipe(
      tap(() => {
        this.getTeams().subscribe();
      })
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
}
