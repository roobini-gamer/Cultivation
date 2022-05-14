/* eslint-disable indent */
import { invoke } from '@tauri-apps/api/tauri'
import React from 'react'
import Tr from '../../../utils/language'

import './NewsSection.css'

interface IProps {
  selected?: string;
}

interface IState {
  selected: string;
  news: any;
}

export default class NewsSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      selected: props.selected || 'commits',
      news: null
    }

    this.setSelected = this.setSelected.bind(this)
    this.showNews = this.showNews.bind(this)
  }

  setSelected(item: string) {
    this.setState({ selected: item })

    this.showNews()
  }

  async showLatestCommits() {
    const commits: string = await invoke('req_get', { url: 'https://api.github.com/repos/Grasscutters/Grasscutter/commits' })
    const obj = JSON.parse(commits)
    
    // Get only first 5
    const commitsList = obj.slice(0, 5)
    const commitsListHtml = commitsList.map((commit: any) => {
      return (
        <div className="Commit" key={commit.sha}>
          <div className="CommitAuthor">{commit.commit.author.name}</div>
          <div className="CommitMessage">{commit.commit.message.substring(0, 50) + '...'}</div>
        </div>
      )
    })

    return commitsListHtml
  }

  async showNews() {
    let news = <div></div>

    switch(this.state.selected) {
      case 'commits':
        news = await this.showLatestCommits()
        break

      case 'latest_version':
        news = <div>Latest version</div>
        break

      default:
        news = <div>Unknown</div>
        break
    }

    this.setState({
      news
    })
  }

  render() {
    return (
      <div className="NewsSection">
        <div className="NewsTabs">
          <div className={'NewsTab ' + (this.state.selected === 'commits' ? 'selected' : '')} id="commits" onClick={() => this.setSelected('commits')}>
            <Tr text="news.latest_commits" />
          </div>
          <div className={'NewsTab ' + (this.state.selected === 'latest_version' ? 'selected' : '')} id="latest_version" onClick={() => this.setSelected('latest_version')}>
            <Tr text="news.latest_version" />
          </div>
        </div>
        <div className="NewsContent">
          {this.state.news}
        </div>
      </div>
    )
  }
}