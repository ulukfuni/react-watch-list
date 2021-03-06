var WatchList = React.createClass({
  getInitialState: function() {
    return{
      player:'',
      gamelogs: [],
      showGameLogs: false
    };
  },
  showGameLogsDiv: function(val) {
    this.setState({showGameLogs: val});
  },
  getPlayer: function(player) {
    this.setState({player: player}, this.getPlayerBoxScore(player)); 
  },
  getPlayerBoxScore: function(player) {
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token token=371939afa66fa11f4d1095251c7c9f65',
        'Accept': 'application/vnd.stattleship.com; version=1'
      };
    $.ajax({
      url: 'https://www.stattleship.com/basketball/nba/game_logs?interval_type=regularseason&season_id=nba-2015-2016&player_id=nba-' + player.replace(' ', '-').toLowerCase(),
      method: 'GET',
      headers: headers,
      beforeSend: function() {
        $('.change').html('Loading...');
      },
      success: function(data) {
        $('.change').html('I am the watch list1');
        this.setState({gamelogs:data.game_logs});
      }.bind(this),
    });
  },
  render: function() {
    return (
      <div className='watch-list'>
        <h1>NBA Watch List</h1>
        <p className='change'>I am the watch list!</p>
        <WatchListForm getplayer={this.getPlayer} showGameLogs={this.showGameLogsDiv} />
        <PlayerStats player={this.state.player} stats={this.state.gamelogs} show={this.state.showGameLogs} />
      </div>
    );
  }
});

var WatchListForm = React.createClass({
  propTypes: {
    getplayer: React.PropTypes.func,
    showGameLogs: React.PropTypes.func
  },
  render: function() {
    return (
      <form className='watchlist-form'>
        <AutoCompleteInput getplayer={this.props.getplayer} showGameLogs={this.props.showGameLogs} />
      </form>
    );
  }
});

var AutoCompleteInput = React.createClass({
  propTypes: {
    getplayer: React.PropTypes.func,
    showGameLogs: React.PropTypes.func
  },
  getInitialState: function(){
    return {player: ''};
  },
  componentDidMount: function(){
    var url = 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2015-16',
    player,
    self = this; //TODO: make date proof
    this.serverRequest = $.get(url, function(data){
      var list = data.resultSets['0'].rowSet,
      playerList = [];
      for (var i in list) {
        playerList.push(list[i][2]);
      }
      $(ReactDOM.findDOMNode(this)).autocomplete({
        source: playerList,
        select: function(event, ui){
          player = ui.item.value;
          self.props.getplayer(player);
          self.props.showGameLogs(true);
        }
      });
    }.bind(this));
  },
  componentWillUnmount: function() {
    $(ReactDOM.findDOMNode(this)).autocomplete('destroy');
    this.serverRequest.abort();
  },
  render: function(){
    return(
      <input name='player-lookup' type='text' placeholder='Enter Player Name...' />
    );
  }
});

var PlayerStats = React.createClass({
  render: function() {
    var gameLogs = this.props.stats,
    gameList = gameLogs.map(function(log, index){
      return (
      <tr key={index}>
        <td>{index+1}</td>
        <td>{log.field_goals_made} / {log.field_goals_attempted}</td>
        <td>{log.free_throws_made} / {log.free_throws_attempted}</td>
        <td>{log.three_pointers_made} / {log.three_pointers_attempted}</td>
        <td>{log.points}</td>
        <td>{log.rebounds_total}</td>
        <td>{log.assists}</td>
        <td>{log.steals}</td>
        <td>{log.blocks}</td>
        <td>{log.turnovers}</td>
        <td>{log.plus_minus}</td>
        <td>{log.personal_fouls}</td>
        <td>{log.time_played_total /60}</td>
      </tr>);
      });
    if (this.props.show) {
      return (
        <div className='game-logs'>
          <h3>{this.props.player}</h3>
          <table className='stats-table'>
            <thead>
              <tr>
                <th>index</th>
                <th>Field Goals</th>
                <th>Free Throws</th>
                <th>3Pointers</th>
                <th>Points</th>
                <th>Rebounds</th>
                <th>Assists</th>
                <th>Steals</th>
                <th>Blocks</th>
                <th>Turnovers</th>
                <th>Plus/Minus</th>
                <th>Fouls</th>
                <th>Minutes</th>
              </tr>
            </thead> 
            <tbody>{gameList}</tbody>
          </table>
        </div>
      );
    }
    return (<div></div>);
  }
});

ReactDOM.render(<WatchList />, document.getElementById('watch-list'))