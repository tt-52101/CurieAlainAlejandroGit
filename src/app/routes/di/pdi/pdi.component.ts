import { Component, OnInit } from '@angular/core';
import { PdiService } from '../../../core/services/pdi.service';
import { FullContentService } from '@delon/abc';

@Component({
  selector: 'app-pdi',
  templateUrl: './pdi.component.html',
  styleUrls: ['./pdi.component.less']
})
export class PdiComponent implements OnInit {

  searchValue = '';
  sortName = null;
  sortValue = null;

  // Modal properties
  isCreateVisible = false;
  isConfigVisible = false;
  chargedData;

  listOfFilterAddress = [
    { text: 'John Brown', value: 'John Brown' },
    { text: 'George Harris', value: 'George Harris' }
  ];

  listOfSearchAddress = [];

  listOfData = [
    {
      name: 'John Brown',
      origin: 32,
      destination: 'New York No. 1 Lake Park',
      modules: 2,
      configuration: {
        module: '1',
        active: false,
        automaticSync: false,
        frecuency: 'each day',
        lastSync: new Date().getDate
      }
    }, {
      name: 'George Harris',
      origin: 10,
      destination: 'Washington DC',
      modules: 3,
      configuration: {
        module: '2',
        active: false,
        automaticSync: false,
        frecuency: 'each two day',
        lastSync: new Date().getDate()
      }
    },
  ];

  constructor(private pdiService: PdiService, private full: FullContentService) { }

  ngOnInit() {
    this.full.toggle();
    //this.listOfDataKtr();
  }

  listOfDisplayData = [...this.listOfData];

  async listOfDataKtr() {
    try {
      const list = await this.pdiService.getListKtr().toPromise();
      console.log(list);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 
   * @param data 
   */
  async create(data: any) {
    try {
      /* const newCn = await this.pdiService.createConnection(data).toPromise(); */
      /* console.log(newCn); */
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 
   * @param data 
   */
  async delete(data: any) {
    try {
      const deletedCn = await this.pdiService.deleteConnection(data).toPromise();
      console.log(deletedCn);
    } catch (error) {
      console.log(error);
    }

    // for (let i = 0; i < this.listOfDisplayData.length; i++) {
    //   if (this.listOfDisplayData[i].name == data.name) {
    //     this.listOfDisplayData.splice(i, 1);
    //     console.log(this.listOfDisplayData);
    //   }
    // }
  }

  storeName(name: string) {
    localStorage.setItem('cnName', name);
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  sort(sortName: string, value: boolean): void {
    this.sortName = sortName;
    this.sortValue = value;
    this.search();
  }

  filterAddressChange(value: string[]): void {
    this.listOfSearchAddress = value;
    this.search();
  }

  search(): void {
    const filterFunc = (item) => {
      return (this.listOfSearchAddress.length ? this.listOfSearchAddress.some(address => item.address.indexOf(address) !== -1) : true) &&
        (item.name.indexOf(this.searchValue) !== -1);
    };
    const data = this.listOfData.filter(item => filterFunc(item));
    this.listOfDisplayData = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
  }

  /**
   * Show modal of edit and create connections with the correct data in each case
   * @param modal :string
   * @param data :Object
   */
  showModal(modal: string, data?): void {
    if (modal == 'isCreateVisible') {
      this.isCreateVisible = true;
    } else {
      this.chargedData = data;
      console.log(this.chargedData);
      this.isConfigVisible = true;
    }
  }

  handleOk(): void {
    this.isCreateVisible = false;
    this.isConfigVisible = false;
  }

  /**
   * Close the modal using the cancel button of modal
   * @param modal :string
   */
  handleCancel(modal: string): void {
    if (modal == 'isCreateVisible') {
      this.isCreateVisible = false;
    } else {
      this.isConfigVisible = false;
    }
  }
}
