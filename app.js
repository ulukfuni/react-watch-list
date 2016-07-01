var WatchList = React.createClass({
  render: function() {
    return (
      <div className='watch-list'>
        <h1>NBA Watch List</h1>
        I am the watch list!
        <WatchListForm/>
      </div>
    );
  }
});

var WatchListForm = React.createClass({
  getInitialState: function() {
    return {player: '', playerList: []};
  },
  render: function() {
    return (
      <form className='watchlist-form'>
        <AutoCompleteInput />
        <input type='submit' value='Post' />
      </form>
    );
  }
});

var AutoCompleteInput = React.createClass({
  componentDidMount: function(){
    var url = 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2015-16';
    this.serverRequest = $.get(url, function(data){
      var list = data.resultSets['0'].rowSet,
      playerList = [];
      for (var i in list) {
        playerList.push(list[i][2]);
      }
      $(ReactDOM.findDOMNode(this)).autocomplete({source:playerList});
    }.bind(this));
  },
  componentWillUnmount: function() {
    $(ReactDOM.findDOMNode(this)).autocomplete('destroy');
    this.serverRequest.abort();
  },
  render: function(){
    return(
      <input type='text' placeholder='Enter Player Name...' />
    );
  }
});

// var Player = React.createClass({});
// var PlayerStats = React.createClass({});

ReactDOM.render(<WatchList />, document.getElementById('watch-list'))