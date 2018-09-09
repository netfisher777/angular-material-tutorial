import {Component, OnInit} from '@angular/core';
import {DataService} from '../data/data.service';
import {DataSource} from '@angular/cdk/table';
import {Post} from '../Post';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {MatDialog} from '@angular/material';
import {PostDialogComponent} from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ['date_posted', 'title', 'category', 'delete'];
  dataSource = new PostDataSource(this.dataService);

  constructor(private dataService: DataService, public auth: AuthService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  deletePost(id) {
    if (this.auth.isAuthenticated()) {
      this.dataService.deletePost(id);
      this.refreshData();
    } else {
      alert('Login in before');
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '600px',
      data: 'Add post'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.dataService.addPost(result.data);
      this.refreshData();
    });
  }

  refreshData() {
    this.dataSource = new PostDataSource(this.dataService);
  }

}

export class PostDataSource extends DataSource<any> {

  constructor(private dataService: DataService) {
    super();
  }

  connect(): Observable<Post[]> {
    return this.dataService.getData();
  }

  disconnect() {
  }

}
