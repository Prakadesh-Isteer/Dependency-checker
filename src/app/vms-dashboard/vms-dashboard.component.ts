import { HttpClient } from '@angular/common/http';
import {
     AfterViewInit,
     Component,
     ElementRef,
     OnInit,
     ViewChild,
} from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import {
     MatSidenavContainer,
     MatSidenavContent,
     MatSidenavModule,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { vulnSyncEnvironments } from '../../environments/vulnSyncEnvironments';
import { storedComputer } from '../../vulnSyncModels/ComputerData';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsConfiguration } from 'ng2-charts';

@Component({
     selector: 'app-vms-dashboard',
     standalone: true,
     imports: [
          CommonModule,
          MatIconModule,
          MatSidenavModule,
          MatToolbar,
          MatNavList,
          RouterOutlet,
     ],
     templateUrl: './vms-dashboard.component.html',
     styleUrl: './vms-dashboard.component.css',
})
export class VmsDashboardComponent implements OnInit, AfterViewInit {
     computerData: any = [];
     applicationsData: any = [];
     storedComputer: any = [];
     severityAppcount: any = 0;
     severityBasedfilterApplications: { [key: string]: any[] } = {Critical:[],High:[],Medium:[],Low:[]};
     chartInstance!: Chart<'pie'>;

     @ViewChild('vulnPieChart') vulnPieChartRef!: ElementRef<HTMLCanvasElement>;

     constructor(private http: HttpClient) { }
     ngOnInit(): void {
          this.fetchComputerFromAgent();
     }
     ngAfterViewInit(): void { }
     fetchComputerFromAgent() {
          this.http.get<any>('assets/data.json').subscribe({
               next: (response) => {
                    console.log(response);
                    this.computerData = response.computers || [];
                    this.drawPieChart();
               },
               error: (error) => {
                    console.log(error);
               },
          });
     }
     drawPieChart(): void {
          if (!this.vulnPieChartRef?.nativeElement) return;
          const ctx = this.vulnPieChartRef.nativeElement.getContext('2d');
          if (!ctx) return;
          if (this.chartInstance) {
               this.chartInstance.destroy();
          }

          const {
               High = [],
               Medium = [],
               Low = [],
               Critical = [],
          } = this.severityBasedfilterApplications;

          this.chartInstance = new Chart(ctx, {
               type: 'pie',
               data: {
                    labels: ['Critical', 'High', 'Medium', 'Low'],
                    datasets: [
                         {
                              data: [Critical.length, High.length, Medium.length, Low.length],
                              backgroundColor: ['#d32f2f', '#fbc02d', '#1976d2', '#388e3c'],
                              borderWidth: 1,
                         },
                    ],
               },
               options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                         duration: 500,
                         animateRotate: false,
                         animateScale: true,
                    },
                    plugins: {
                         legend: {
                              position: 'bottom',
                              labels: {
                                   font: { size: 14 },
                                   color: '#444',
                              },
                         },
                         tooltip: {
                              callbacks: {
                                   label: function (context) {
                                        const label = context.label || '';
                                        const value = context.parsed || 0;
                                        return `${label}: ${value} apps`;
                                   },
                              },
                         },
                    },
               },
          });
     }

     viewApplications(applications: any[]) {
           this.severityBasedfilterApplications = {Critical:[],High:[],Medium:[],Low:[]};
           this.applicationsData = applications;
           const severityApps:{ [key: string]: any[] } = {Critcal:[],High:[],Medium:[],Low:[]}
           this.applicationsData.forEach((app: any)=> {
               console.log(app)
                 app.vulnerabilities.forEach((vuln: any)=> {
                    console.log(vuln)
                      switch(vuln.severity) {
                         case 'Critical':
                           this.severityBasedfilterApplications['Critical'].push(app);
                           break;
                         case 'High':
                           this.severityBasedfilterApplications['High'].push(app);  
                           break;  
                         case 'Medium':
                           this.severityBasedfilterApplications['Medium'].push(app);  
                           break;  
                         case 'Low':
                           this.severityBasedfilterApplications['Low'].push(app);  
                           break;  
                         default:
                           break;   
                      }
                 });
           });
          
           this.severityAppcount = this.severityBasedfilterApplications['Critical']?.length + this.severityBasedfilterApplications['High']?.length +
                                  this.severityBasedfilterApplications['Medium']?.length + this.severityBasedfilterApplications['Low']?.length
           this.drawPieChart();
     }
}
