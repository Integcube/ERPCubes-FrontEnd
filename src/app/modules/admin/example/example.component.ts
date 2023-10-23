import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
    id: string;
    name: string;
    progress: string;
    fruit: string;
    age: number;
    country: string;
    email: string;
    hobby: string;
    gender: string;
    isAdmin: boolean;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
    'blueberry',
    'lychee',
    'kiwi',
    'mango',
    'peach',
    'lime',
    'pomegranate',
    'pineapple',
];
const NAMES: string[] = [
    'Maia',
    'Asher',
    'Olivia',
    'Atticus',
    'Amelia',
    'Jack',
    'Charlotte',
    'Theodore',
    'Isla',
    'Oliver',
    'Isabella',
    'Jasper',
    'Cora',
    'Levi',
    'Violet',
    'Arthur',
    'Mia',
    'Thomas',
    'Elizabeth',
];

@Component({
    selector: 'example',
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent {
    searchInputControl: UntypedFormControl = new UntypedFormControl();

userDataArray: UserData[] = [
        {
            id: "1",
            name: "John",
            progress: "50%",
            fruit: "Apple",
            age: 32,
            country: "USA",
            email: "john@example.com",
            hobby: "Swimming",
            gender: "Male",
            isAdmin: true
        },
        {
            id: "2",
            name: "Alice",
            progress: "75%",
            fruit: "Banana",
            age: 25,
            country: "Canada",
            email: "alice@example.com",
            hobby: "Gardening",
            gender: "Female",
            isAdmin: false
        },
        {
            id: "3",
            name: "Bob",
            progress: "30%",
            fruit: "Orange",
            age: 40,
            country: "UK",
            email: "bob@example.com",
            hobby: "Cooking",
            gender: "Male",
            isAdmin: false
        },
        {
            id: "4",
            name: "Eve",
            progress: "90%",
            fruit: "Grapes",
            age: 28,
            country: "Australia",
            email: "eve@example.com",
            hobby: "Painting",
            gender: "Female",
            isAdmin: true
        },
        {
            id: "5",
            name: "Charlie",
            progress: "10%",
            fruit: "Kiwi",
            age: 35,
            country: "New Zealand",
            email: "charlie@example.com",
            hobby: "Hiking",
            gender: "Male",
            isAdmin: false
        },
        {
            id: "6",
            name: "Sarah",
            progress: "40%",
            fruit: "Mango",
            age: 22,
            country: "India",
            email: "sarah@example.com",
            hobby: "Dancing",
            gender: "Female",
            isAdmin: false
        },
        {
            id: "7",
            name: "Michael",
            progress: "65%",
            fruit: "Pineapple",
            age: 50,
            country: "Canada",
            email: "michael@example.com",
            hobby: "Photography",
            gender: "Male",
            isAdmin: true
        },
        {
            id: "8",
            name: "Emma",
            progress: "80%",
            fruit: "Strawberry",
            age: 29,
            country: "USA",
            email: "emma@example.com",
            hobby: "Reading",
            gender: "Female",
            isAdmin: false
        },
        {
            id: "9",
            name: "David",
            progress: "20%",
            fruit: "Blueberry",
            age: 38,
            country: "UK",
            email: "david@example.com",
            hobby: "Fishing",
            gender: "Male",
            isAdmin: false
        },
        {
            id: "10",
            name: "Olivia",
            progress: "55%",
            fruit: "Cherry",
            age: 27,
            country: "Australia",
            email: "olivia@example.com",
            hobby: "Traveling",
            gender: "Female",
            isAdmin: true
        }
    ];
    
    
    displayedColumns: string[] = ['id', 'name', 'progress', 'fruit','age','country','email','hobby','gender'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor() {
        // Create 100 users

        this.dataSource = new MatTableDataSource(this.userDataArray);

    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
