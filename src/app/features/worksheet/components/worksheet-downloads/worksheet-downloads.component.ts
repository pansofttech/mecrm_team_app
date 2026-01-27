import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-worksheet-downloads',
  templateUrl: './worksheet-downloads.component.html',
  styleUrls: ['./worksheet-downloads.component.scss']
})
export class WorksheetDownloadsComponent {
  // @Input()
  // public worksheetDownloadDetails!: FormGroup;
  public showWorksheetAPILoader = false;
}
