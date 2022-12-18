import React from "react";
import {
  Button,
  Container,
  Grid,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { fetchProjects, fetchTeams, setNewAdmin } from "../store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CreateTeam from "./CreateTeam";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { JoinTeam } from "./JoinTeam";
import CancelIcon from "@mui/icons-material/Cancel";
import { RemoveTeamMember } from "../store";
import axios from "axios";
import { useState } from "react";
import EmailSummary from "./EmailSummary";

const Team = () => {
  const dispatch = useDispatch();
  const { teams, auth } = useSelector((state) => state);
  let adminView = false;

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchProjects());
  }, [auth]);

  if (auth.id === teams.adminId) {
    adminView = true;
  }

  const [recipientInfo, setRecipientInfo] = useState({
    email: "",
  });

  const onChange = (ev) => {
    setRecipientInfo({ ...recipientInfo, [ev.target.name]: ev.target.value });
  };

  const inviteToTeam = async (ev) => {
    ev.preventDefault();
    await axios.post("/api/emails/invite/team", {
      teamId: teams.id,
      recipient: recipientInfo.email,
      senderName: auth.firstName,
    });
    setRecipientInfo("");
  };

  return (
    <Container>
      {auth.teamId !== null ? (
        <Paper>
          <Typography mt={7} align="center" variant="h3">
            My Team
            <Grid
              container
              spacing={3}
              sx={{
                margin: "1rem",
                padding: "1rem",
              }}>
              {teams.users &&
                teams.users.map((user) => {
                  return (
                    <Grid
                      key={user.id}
                      container
                      align="center"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: 5,
                        borderRadius: 2,
                        margin: "1rem",
                        padding: "1rem",
                        width: "300px",
                      }}>
                      <Grid item>
                        <Typography variant="h6">
                          Username - {user.username}
                        </Typography>
                      </Grid>
                      <Grid item align="left">
                        <Typography variant="subtitle2">
                          First Name: {user.firstName}
                        </Typography>
                      </Grid>
                      <Grid item align="left">
                        <Typography variant="subtitle2">
                          Last Name: {user.lastName}
                        </Typography>
                      </Grid>
                      <Grid item align="left">
                        <Typography variant="subtitle2">
                          Email: {user.email}
                        </Typography>
                      </Grid>
                      {adminView && user.id !== teams.adminId && (
                        <Grid
                          container
                          sx={{ display: "flex", flexDirection: "row" }}>
                          <Grid item>
                            <Button
                              onClick={() => dispatch(RemoveTeamMember(user))}>
                              {" "}
                              <CancelIcon />
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button onClick={() => dispatch(setNewAdmin(user))}>
                              Set as new admin
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  );
                })}
            </Grid>
          </Typography>
          <form onSubmit={(ev) => inviteToTeam(ev)}>
            <Typography variant="h3" align="center">
              Invite new user to team
            </Typography>
            <TextField
              label="Recipient's email address"
              name="email"
              onChange={onChange}
              required
            />
            <Button variant="contained" fullWidth type="submit">
              Invite User
            </Button>
          </form>
        </Paper>
      ) : (
        <div>
          <CreateTeam />
          <JoinTeam />
        </div>
      )}
      {adminView && (
        <div>
          <br />
          <EmailSummary />
        </div>
      )}
    </Container>
  );
};

export default Team;
