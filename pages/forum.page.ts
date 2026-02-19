import { BasePage } from './base.page';

export class ForumPage extends BasePage {
  readonly topicList = this.getByTestId('forum-topic-list');
  readonly newTopicButton = this.getByTestId('forum-newTopic-button');
  readonly searchInput = this.getByTestId('forum-search-input');

  async open(): Promise<void> {
    await this.navigate('/forum');
  }
}
