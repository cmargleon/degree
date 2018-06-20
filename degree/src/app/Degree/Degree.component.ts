/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DegreeService } from './Degree.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-degree',
  templateUrl: './Degree.component.html',
  styleUrls: ['./Degree.component.css'],
  providers: [DegreeService]
})
export class DegreeComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  degreeId = new FormControl('', Validators.required);
  memberId = new FormControl('', Validators.required);
  Owner = new FormControl('', Validators.required);
  DegreeType = new FormControl('', Validators.required);
  DegreeStatus = new FormControl('', Validators.required);
  Major = new FormControl('', Validators.required);
  Major2 = new FormControl('', Validators.required);
  Minor = new FormControl('', Validators.required);
  Minor2 = new FormControl('', Validators.required);
  gpa = new FormControl('', Validators.required);
  StartYear = new FormControl('', Validators.required);
  GradYear = new FormControl('', Validators.required);
  authorized = new FormControl('', Validators.required);

  constructor(private serviceDegree: DegreeService, fb: FormBuilder) {
    this.myForm = fb.group({
      degreeId: this.degreeId,
      memberId: this.memberId,
      Owner: this.Owner,
      DegreeType: this.DegreeType,
      DegreeStatus: this.DegreeStatus,
      Major: this.Major,
      Major2: this.Major2,
      Minor: this.Minor,
      Minor2: this.Minor2,
      gpa: this.gpa,
      StartYear: this.StartYear,
      GradYear: this.GradYear,
      authorized: this.authorized
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDegree.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.degree.ucsd.Degree',
      'degreeId': this.degreeId.value,
      'memberId': this.memberId.value,
      'Owner': this.Owner.value,
      'DegreeType': this.DegreeType.value,
      'DegreeStatus': this.DegreeStatus.value,
      'Major': this.Major.value,
      'Major2': this.Major2.value,
      'Minor': this.Minor.value,
      'Minor2': this.Minor2.value,
      'gpa': this.gpa.value,
      'StartYear': this.StartYear.value,
      'GradYear': this.GradYear.value,
      'authorized': this.authorized.value
    };

    this.myForm.setValue({
      'degreeId': null,
      'memberId': null,
      'Owner': null,
      'DegreeType': null,
      'DegreeStatus': null,
      'Major': null,
      'Major2': null,
      'Minor': null,
      'Minor2': null,
      'gpa': null,
      'StartYear': null,
      'GradYear': null,
      'authorized': null
    });

    return this.serviceDegree.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'degreeId': null,
        'memberId': null,
        'Owner': null,
        'DegreeType': null,
        'DegreeStatus': null,
        'Major': null,
        'Major2': null,
        'Minor': null,
        'Minor2': null,
        'gpa': null,
        'StartYear': null,
        'GradYear': null,
        'authorized': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.degree.ucsd.Degree',
      'memberId': this.memberId.value,
      'Owner': this.Owner.value,
      'DegreeType': this.DegreeType.value,
      'DegreeStatus': this.DegreeStatus.value,
      'Major': this.Major.value,
      'Major2': this.Major2.value,
      'Minor': this.Minor.value,
      'Minor2': this.Minor2.value,
      'gpa': this.gpa.value,
      'StartYear': this.StartYear.value,
      'GradYear': this.GradYear.value,
      'authorized': this.authorized.value
    };

    return this.serviceDegree.updateAsset(form.get('degreeId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceDegree.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceDegree.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'degreeId': null,
        'memberId': null,
        'Owner': null,
        'DegreeType': null,
        'DegreeStatus': null,
        'Major': null,
        'Major2': null,
        'Minor': null,
        'Minor2': null,
        'gpa': null,
        'StartYear': null,
        'GradYear': null,
        'authorized': null
      };

      if (result.degreeId) {
        formObject.degreeId = result.degreeId;
      } else {
        formObject.degreeId = null;
      }

      if (result.memberId) {
        formObject.memberId = result.memberId;
      } else {
        formObject.memberId = null;
      }

      if (result.Owner) {
        formObject.Owner = result.Owner;
      } else {
        formObject.Owner = null;
      }

      if (result.DegreeType) {
        formObject.DegreeType = result.DegreeType;
      } else {
        formObject.DegreeType = null;
      }

      if (result.DegreeStatus) {
        formObject.DegreeStatus = result.DegreeStatus;
      } else {
        formObject.DegreeStatus = null;
      }

      if (result.Major) {
        formObject.Major = result.Major;
      } else {
        formObject.Major = null;
      }

      if (result.Major2) {
        formObject.Major2 = result.Major2;
      } else {
        formObject.Major2 = null;
      }

      if (result.Minor) {
        formObject.Minor = result.Minor;
      } else {
        formObject.Minor = null;
      }

      if (result.Minor2) {
        formObject.Minor2 = result.Minor2;
      } else {
        formObject.Minor2 = null;
      }

      if (result.gpa) {
        formObject.gpa = result.gpa;
      } else {
        formObject.gpa = null;
      }

      if (result.StartYear) {
        formObject.StartYear = result.StartYear;
      } else {
        formObject.StartYear = null;
      }

      if (result.GradYear) {
        formObject.GradYear = result.GradYear;
      } else {
        formObject.GradYear = null;
      }

      if (result.authorized) {
        formObject.authorized = result.authorized;
      } else {
        formObject.authorized = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'degreeId': null,
      'memberId': null,
      'Owner': null,
      'DegreeType': null,
      'DegreeStatus': null,
      'Major': null,
      'Major2': null,
      'Minor': null,
      'Minor2': null,
      'gpa': null,
      'StartYear': null,
      'GradYear': null,
      'authorized': null
      });
  }

}
