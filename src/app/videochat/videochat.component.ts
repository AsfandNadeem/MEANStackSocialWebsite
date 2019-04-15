import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.css']
})
export class VideochatComponent implements OnInit {

  enteredTitle = '';

  @ViewChild('myvideo') myVideo: any;

  title = 'app works!';

  targetpeer: any;
  peer: any;
  n = <any>navigator;



  ngOnInit() {
    const video = this.myVideo.nativeElement;
    let peerx: any;
    this.n.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
    this.n.getUserMedia({video: true, audio: true}, function(stream) {
      peerx = new SimplePeer ({
        initiator: location.hash === '#init',
        trickle: false,
        stream: stream
      })

      peerx.on('signal', function(data) {
        alert(JSON.stringify(data));

        console.log(JSON.stringify(data));
        (<HTMLTextAreaElement>document.getElementById('key')).value = JSON.stringify(data);

        this.targetpeer = data;
      })

      peerx.on('data', function(data) {
        console.log('Recieved message:' + data);
      })

      peerx.on('stream', function(stream) {
        //video.src =window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
      })

    }, function(err){
      console.log('Failed to get stream', err);
    });

    setTimeout(() => {
      this.peer = peerx;
      console.log(this.peer);
    }, 5000);
  }

  connect() {
    //alert(this.targetpeer);
    this.peer.signal(JSON.parse(this.targetpeer));
  }

  message() {
    this.peer.send('Hello world');
  }

}
