import { BasePage } from './base.page';

export class ForumPage extends BasePage {
  readonly topicsList = this.getByTestId('forum-topics-list');
  readonly topicItem = this.getByTestId('forum-topic-item');
  readonly createTopicButton = this.getByTestId('forum-create-topic-button');
  readonly createTopicDialog = this.getByTestId('forum-create-topic-dialog');
  readonly filterButton = this.getByTestId('forum-filter-button');
  readonly filterDialog = this.getByTestId('forum-filter-dialog');

  async open(): Promise<void> {
    await this.navigate('/forum');
  }
}
