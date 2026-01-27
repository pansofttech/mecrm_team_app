import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcPartsDetails, svcDependentComboData } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-parts-search',
  templateUrl: './parts-search.component.html',
  styleUrl: './parts-search.component.scss'
})

export class PartsSearchComponent {
  showAPILoader = false;
  loaderMessage: string = 'Searching Parts...';
  partsSearchForm!: FormGroup;
  searchPartsDetailsCard: svcPartsDetails[] = [];

  dependantComboDataForSupplier: svcDependentComboData[] = [];
  filteredSupplierData: svcDependentComboData[] = [];
  dependantComboDataForManufacturer: svcDependentComboData[] = [];
  filteredManufacturerData: svcDependentComboData[] = [];
  isSearchTabOpen: boolean = true;
  public virtual: any = {
    itemHeight: 28,
  };

  @Input() addedPartsDetailsCard: svcPartsDetails[] = [];
  @Input() srid: number = 0;
  @Output() onBackClickHandle: EventEmitter<void> = new EventEmitter<void>();

  constructor(    
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private loaderService: LoaderService,
    public  commonService: CommonService,
    private serviceCalendarService: ServiceCalendarService,
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.partsSearchForm = this.formBuilder.group({
      manufacturer: new FormControl(null ,Validators.nullValidator),
      supplier: new FormControl(null ,Validators.nullValidator),
      partNo: new FormControl(null ,Validators.required),
      productLine: new FormControl(null, Validators.nullValidator),
      description: new FormControl('', Validators.nullValidator),
    });
    this.addedPartsDetailsCard = this.serviceCalendarService.addedPartsDetailsCard;
    this.getDependantComboForSupplier();
    this.getDependantComboForManufacturer();
  }

  getDependantComboForManufacturer(){
    this.serviceCalendarService.getDependentCombo("PRMANUFACTURER",0,this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForManufacturer = data;
      this.filteredManufacturerData = data;
    });
  }

  getDependantComboForSupplier(){
    this.serviceCalendarService.getDependentCombo("ALLSUPPLIERS",0,this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForSupplier = data;
      this.filteredSupplierData = data;
    });
  }

  onFilterChange(filter: string, type: string): void {
      if(type == 'Manufacturer'){
        this.filteredManufacturerData = this.dependantComboDataForManufacturer.filter(item =>
          item.comboName?.toLowerCase().includes(filter.toLowerCase())
        );
      }
      else if(type == 'Supplier'){
        this.filteredSupplierData = this.dependantComboDataForSupplier.filter(item =>
          item.comboName?.toLowerCase().includes(filter.toLowerCase())
        );
      }
  }

  onCardClick(event: Event) {
    const targetElement = event.currentTarget as HTMLElement;
    targetElement.classList.add('selected');
        setTimeout(() => {
      targetElement.classList.remove('selected');
    }, 2000);
  }

  addPartsToList(index: number) {
    const selectedPart = this.searchPartsDetailsCard[index];
    const existingPart = this.addedPartsDetailsCard.find(
      part => part.partNo?.trim() === selectedPart.partNo?.trim() &&
              part.option === selectedPart.option                 &&
              part.supplierID === selectedPart.supplierID         &&
              part.supplierName === selectedPart.supplierName);

    if (existingPart) {
        existingPart.quantity = existingPart.quantity ? existingPart.quantity + 1 : 1;
    } else {
        const clonedPart = JSON.parse(JSON.stringify(selectedPart));
        clonedPart.quantity = 1;
        this.addedPartsDetailsCard.push(clonedPart);
    }
    
    this.serviceCalendarService.addedPartsDetailsCard = this.addedPartsDetailsCard;
  }

  increaseQuantity(index: number) {
    const selectedPart = this.searchPartsDetailsCard[index];
      this.animateCardBorder(index);

    let existingPart = this.addedPartsDetailsCard.find(
      part =>
        part.partNo?.trim() === selectedPart.partNo?.trim() &&
        part.option === selectedPart.option &&
        part.supplierID === selectedPart.supplierID &&
        part.supplierName === selectedPart.supplierName
    );

    if (existingPart) {
      existingPart.quantity = (existingPart.quantity ?? 0) + 1;
    } else {
      const clonedPart = { ...selectedPart, quantity: 1 };
      this.addedPartsDetailsCard.push(clonedPart);
    }

    this.serviceCalendarService.addedPartsDetailsCard = this.addedPartsDetailsCard;
  }

  decreaseQuantity(index: number) {
    const selectedPart = this.searchPartsDetailsCard[index];
          this.animateCardBorder(index);

    let existingPart = this.addedPartsDetailsCard.find(
      part =>
        part.partNo?.trim() === selectedPart.partNo?.trim() &&
        part.option === selectedPart.option &&
        part.supplierID === selectedPart.supplierID &&
        part.supplierName === selectedPart.supplierName
    );

    if (existingPart && existingPart.quantity && existingPart.quantity > 1) {
      existingPart.quantity -= 1;
    } else if (existingPart) {
      this.addedPartsDetailsCard = this.addedPartsDetailsCard.filter(p => p != existingPart);
    }

    this.serviceCalendarService.addedPartsDetailsCard = this.addedPartsDetailsCard;
  }
  
  private animateCardBorder(i: number) {
    const card = document.querySelectorAll('.part-details-listview--cards')[i] as HTMLElement;

    if (card) {
      card.classList.remove('animate-border'); // reset if already applied
      void card.offsetWidth; // force reflow
      card.classList.add('animate-border');
    }
  }

  getPartQuantity(index: number): number {
    const selectedPart = this.searchPartsDetailsCard[index];
    const existingPart = this.addedPartsDetailsCard.find(
      part =>
        part.partNo?.trim() === selectedPart.partNo?.trim() &&
        part.option === selectedPart.option &&
        part.supplierID === selectedPart.supplierID &&
        part.supplierName === selectedPart.supplierName
    );
    return existingPart?.quantity ?? 0;
  }

  onDescriptionClick(index: number){
    this.searchPartsDetailsCard[index].isDescOpen = !this.searchPartsDetailsCard[index].isDescOpen;  
  }

  onSearchClick(){
    this.isSearchTabOpen = !this.isSearchTabOpen;
  }

  onPartsSearchClick(){
    if(this.partsSearchForm.valid){
      this.isSearchTabOpen = false;
      const searchFormValue = this.partsSearchForm.value;
      this.loaderService.showLoader();
      this.serviceCalendarService.getSearchPartsDetails(
        searchFormValue.manufacturer == null? 0: searchFormValue.manufacturer.comboId,
        searchFormValue.supplier == null? 0: searchFormValue.supplier.comboId,
        searchFormValue.partNo,
        searchFormValue.description == null? '': searchFormValue.description,
        searchFormValue.productLine == null? '': searchFormValue.productLine,
        0,
        this.srid
      ).subscribe((data: any) => {
        // this.loaderService.hideLoader();
        this.searchPartsDetailsCard = data.filter((item:any) => item.price !== 0 && item.price != null && item.isActive === true);
      });
    }
    else{
      this.partsSearchForm.markAllAsTouched();
    }
    this.loaderService.hideLoader();
  }

  onPartsSearchClear(){
    this.partsSearchForm.reset();
    this.searchPartsDetailsCard = [];
  }

  onBackClick() {
    this.onBackClickHandle.emit();
  }

}
