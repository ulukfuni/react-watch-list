var WatchList = React.createClass({
  render: function() {
    return (
      <div className='watch-list'>
        <h1>NBA Watch List</h1>
        I am the watch list!
        <WatchListForm source={this.props.source}/>
      </div>
    );
  }
});

var WatchListForm = React.createClass({
  getInitialState: function() {
    return {player: '', playerList: []};
  },
  componentDidMount: function () {
    this.serverRequest = $.get(this.props.source, function(data){
      var list = data.resultSets['0'].rowSet;
      this.setState({player: '', playerList: list});
    }.bind(this));
  },
  render: function() { console.log(this.state);
    return (
      <form className='watchlist-form'>
        <input type='text' placeholder='Enter Player Name...' value={this.state.player} />
        <input type='submit' value='Post' />
      </form>
    );
  }
});

// var Player = React.createClass({});
// var PlayerStats = React.createClass({});

ReactDOM.render(<WatchList source='http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2015-16'/>, document.getElementById('watch-list'))