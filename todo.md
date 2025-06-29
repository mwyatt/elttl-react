# Todo
- Handle actual server errors (eg. fixture single cant find venue) - needs to be a custom error page and  also log the error on the server to inspect
- Make small ads appear all over site?
- Trial new season / generate fixtures on the server
- Google Analytics
- Migrate to new server
  - Setup ssh
  - Swap domain

# Wish
- Homepage add best season performers
  - Highest rank changes top 3
  - Most 3-0 wins
  - Teams with biggest wins
- Homepage links to divisional overviews
- Chart for Awarding Ranking Points - How do the ranking points work?
- Calculating Handicaps using player’s rank 
- Divisional overview showing all teams and the contact information

## Search plan
fast simple search for players, teams, venues, fixtures
  - Search by team name
  - Search by venue name
  - Search by fixture date
  - Search by player name
  - Search by week description

## Season Weeks Plan

season generation
create weeks from september to june the next year with a blank description

at this point could full in weeks with other things like
  - Closed Competitions
  - Fred Holden Cup
  - Other competitions

fixture generation
automatically assign fixtures to weeks
  cant be home 2 weeks in a row
  some weeks are going to be other things
  some weeks are going to be blank
  home nights for teams cant clash

weeks management ui
able to take any fixtures and drag and drop them into a week
able to change the week description


team page
add information pull for the tennisWeeks table, this gets all fixtures and
arranges them in a calendar style format with a pointer on the current week
previous weeks are grayed out and unfulfilled preview fixtures are marked
pending fulfillment or rearranged

league calendar page
shows all weeks and overview of what is happening, fixture weeks could link to a
week single page with all fixtures for that week

Ideas
Whats on this week? What's coming up? on homepage