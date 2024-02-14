import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
    selector: 'file-manager-details',
    templateUrl: './dialog.component.html',
})
export class FileManagerDialogComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}