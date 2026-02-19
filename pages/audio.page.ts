import { BasePage } from './base.page';

export class AudioPage extends BasePage {
  readonly playerContainer = this.getByTestId('audio-player-container');
  readonly trackList = this.getByTestId('audio-track-list');
  readonly playButton = this.getByTestId('audio-play-button');

  async open(): Promise<void> {
    await this.navigate('/audio');
  }
}
