API notes
GET competition
GET /api/competitions/:competitionId?userId=<id>
Response contains:
competition details
calculated lifecycle
participant count
spots remaining
current user's participation
Register
POST /api/competitions/:competitionId/register
Body:
{
  "userId": "..."
}
The server checks dates, capacity and duplicate registration.
Cancel
DELETE /api/competitions/:competitionId/register
Body:
{
  "userId": "..."
}
