import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Client,
  WebSocketTunnel,
  Mouse,
  Keyboard,
} from '@illgrenoble/guacamole-common-js';
import { ProjectsService } from '../../../shared/project/projects.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'dinivas-ssh-terminal',
  templateUrl: './ssh-terminal.component.html',
  styleUrls: ['./ssh-terminal.component.scss'],
})
export class SshTerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sshTerminal', { static: false })
  display: ElementRef;
  guac: Client;
  constructor(
    public dialogRef: MatDialogRef<SshTerminalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly projectService: ProjectsService
  ) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Instantiate client, using an HTTP tunnel for communications.
    this.guac = new Client(new WebSocketTunnel(environment.guacamole.wsUrl));

    // Add client to display div
    this.display.nativeElement.appendChild(this.guac.getDisplay().getElement());

    // Error handler
    this.guac.onerror = function (error) {
      alert(JSON.stringify(error));
    };
    this.projectService
      .getProjectGuacamoleSSHToken(this.data.project.id)
      .subscribe((data) => {
        // Connect
        this.guac.connect(
          `token=${data.token}&width=${environment.guacamole.terminalWidth}&height=${environment.guacamole.terminalHeight}`
        );
        this.display.nativeElement.focus();

        // Mouse
        const mouse = new Mouse(this.guac.getDisplay().getElement());

        mouse.onmousedown =
          mouse.onmouseup =
          mouse.onmousemove =
            (mouseState) => {
              this.guac.sendMouseState(mouseState);
            };

        // Keyboard
        const keyboard = new Keyboard(document);

        keyboard.onkeydown = (keysym) => {
          this.guac.sendKeyEvent(1, keysym);
          return false;
        };

        keyboard.onkeyup = (keysym) => {
          this.guac.sendKeyEvent(0, keysym);
        };
      });
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.guac.disconnect();
  }
}
