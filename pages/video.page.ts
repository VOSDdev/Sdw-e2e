import { BasePage } from './base.page';

export class VideoPage extends BasePage {
  readonly playerContainer = this.getByTestId('video-player-container');
  readonly videoList = this.getByTestId('video-content-list');
  readonly playButton = this.getByTestId('video-play-button');

  async open(): Promise<void> {
    await this.navigate('/video');
  }
}
