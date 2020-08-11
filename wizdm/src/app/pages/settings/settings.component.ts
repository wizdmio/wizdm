import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  defaultSettings = [
    {
      icon: "account_box",
      label: "Profile",
      link: "profile"
    },
    {
      icon: "lock",
      label: "Account",
      link: "account"
    },
    {
      icon: "exit_to_app",
      label: "Sign Out",
      link: "../logout"
    }
  ];
}
