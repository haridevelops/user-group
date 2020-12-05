import { Component, OnInit } from '@angular/core';
import { User } from './app.model';
import { AppService } from './app.service';
import { UserGroup } from './user-group-.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'user-group';
  showCreateForm: boolean = false;

  userList: Array<User> = [];
  renderUserList: Array<User> = [];
  groupName = '';
  groupDescription = '';
  private userGroups: Array<UserGroup>;

  constructor(private service: AppService) {
    this.userGroups = []
  }

  ngOnInit(): void {
    this.service.getData().subscribe((users: Array<User>) => {
      users.forEach(user => {
        user['selected'] = false;
      });
      this.userList = users;
    });
  }

  createUserGroup() {
    this.renderUserList = [ ...this.userList ];
    this.renderUserList.forEach(render => render['selected'] = false);
    this.showCreateForm = true;
  }

  tempUserHolder: Array<User> = [];
  userSelected(user) {
    user['selected'] = !user['selected'];

    if (user['selected']) {
      // add to a new group
      this.tempUserHolder.push(user);
    } else {
      // remove from the selected list
      this.tempUserHolder = this.tempUserHolder.filter(exisitingUser => {
        if (exisitingUser.id !== user.id) {
          return exisitingUser;
        }
      });
    }
  }

  closeContainer() {
    this.groupDescription = '';
    this.groupName = '';
    this.renderUserList = [];
    this.showCreateForm = false;
  }

  trackGroup(index:number, group: UserGroup) {
    return group.groupName
  }

  createGroup() {
    const userGroup: UserGroup = {
      'groupName': this.groupName,
      'groupDescription': this.groupDescription,
      'users': this.tempUserHolder
    }
    this.userGroups = [ userGroup, ...this.userGroups ];
    this.tempUserHolder = [];
    this.renderUserList = [];
    this.showCreateForm = false;
    this.groupDescription = '';
    this.groupName = '';
    console.log(this.userGroups);
  }

  deleteGroup(group: UserGroup) {
    this.userGroups = this.userGroups.filter(userGroup => {
      if (userGroup.groupName !== group.groupName) {
        return userGroup;
      }
    })
  }

  sort(sortIndicator, key) {
    if (sortIndicator === 1) {
      // asc
      this.renderUserList.sort(function (a, b) {
        return a[key].localeCompare(b[key]);
      });

    } else {
      // dsc
      this.renderUserList.sort(function (a, b) {
        return b[key].localeCompare(a[key]);
      });
    }
  }

  imgURL: string | ArrayBuffer = 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/user14b9a23c.png';
  preview(event) {
    const file = event.target.files[0]
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

}
