import { Component, OnInit, ViewChild } from '@angular/core';
import { DataServices } from 'src/app/services/data.services';
import { forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-patient-response-view',
  templateUrl: './patient-response-view.component.html',
  styleUrls: ['./patient-response-view.component.css']
})
export class PatientResponseViewComponent implements OnInit {
  allQuestions: any;
  allResponses: any;
  progressData: any;
  mappedQuestionAnswer: any;
  p_id: string


  constructor(private data: DataServices) {
    this.p_id = '0'
  }
  
  ngOnInit(): void {
    this.data.getPatientSubjectBehaviour().subscribe(value => this.p_id = value)
    this.getProgressData()
  }

  getProgressData() {
    this.data.getSectionProgress(this.p_id).subscribe(
      value => {
        console.log(value)
        this.progressData = value.section
                              .filter((v:any) => v.id > 0)
                              .map((d:any) => ({title: d.title, id: d.id}))
        console.log(this.progressData)
      },
      err => {
        console.log(err)
      }
    )
  }

  getQuestions(event: Event) {
    let s_id = (event.target as HTMLInputElement).value
    forkJoin([
      this.data.getQuestionBySectionId(s_id),
      this.data.getResponseBySectionId(s_id, this.p_id)
    ])
    .subscribe(
      (data: any) => {
        this.mappedQuestionAnswer = this.getMappedQuestionAnswer(data[0], data[1])
        console.log(this.mappedQuestionAnswer)
      },
      (err: any) => console.log(err)
    )
  }

  getMappedQuestionAnswer(allQuestions: any, allResponses: any) {
    let mappedData = allQuestions.map((question: any) => {
      let response = allResponses.find((response: any) => response.id === question.id)
      return {question, response}
    })
    return mappedData
  }

}
