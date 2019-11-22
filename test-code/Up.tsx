import MUIButton from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, WithStyles, WithTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import Button from '../../formElements/Button';
import theme from '../../theme-light';
import style from '../style';

type IProps = WithStyles<typeof style> &
  WithTheme & {
    back: () => any;
    isLoading?: boolean;
    navigate: (path: string) => any;
    register: (
      username: string,
      password: string,
      email: string,
      subscribeNL: boolean,
    ) => any;
    defaultUserName?: string;
    confirmCode: (username: string, confirmationCode: string) => any;
    isConfirmationForm?: boolean;
  };
interface IState {
  username?: string;
  email?: string;
  password?: string;
  confirmationCode?: string;
  subscribeNL?: boolean;
}

export class SignIn extends React.PureComponent<IProps, IState> {
  public state: IState = {
    subscribeNL: true,
  };

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.defaultUserName && !state.username) {
      return { username: props.defaultUserName };
    }
  }

  // public toggleSaveDialog = () =>
  //   this.setState(({ showSaveDialog }) => ({
  //     showSaveDialog: !showSaveDialog,
  //   }));
  //
  public updateSubscribeNL = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    this.setState({ subscribeNL: value === 'true' });
  };

  public updateStateCurried = (key: keyof IState) => (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = evt.currentTarget.value;
    this.setState({ [key]: value });
  };

  public createAccount = (event: React.SyntheticEvent<HTMLElement>): void => {
    event.preventDefault();
    const { username, password, email, subscribeNL } = this.state;
    this.props.register(username, password, email, subscribeNL);
  };

  public confirmCode = (event: React.SyntheticEvent<HTMLElement>): void => {
    event.preventDefault();
    const { confirmationCode, username } = this.state;
    this.props.confirmCode(username, confirmationCode);
  };

  public createAccountForm = () => {
    const { classes, isLoading } = this.props;
    const { username, password, email } = this.state;
    return (
      <form className={classes.form} onSubmit={this.createAccount}>
        <TextField
          name="username"
          onChange={this.updateStateCurried('username')}
          type="text"
          label="Username"
          margin="normal"
          autoFocus={true}
          value={username}
          required={true}
          variant="outlined"
          className={classes.input}
          fullWidth={true}
          id="password"
          InputLabelProps={{
            shrink: true,
          }}
          autoComplete="current-password"
        />
        <TextField
          id="email"
          margin="normal"
          onChange={this.updateStateCurried('email')}
          name="email"
          label="Email"
          value={email}
          autoComplete="email"
          variant="outlined"
          required={true}
          fullWidth={true}
          className={classes.input}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          name="password"
          type="password"
          label="Password"
          onChange={this.updateStateCurried('password')}
          margin="normal"
          variant="outlined"
          required={true}
          className={classes.input}
          fullWidth={true}
          value={password}
          id="password"
          InputLabelProps={{
            shrink: true,
          }}
          autoComplete="current-password"
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={this.updateSubscribeNL}
              value={!this.state.subscribeNL}
              checked={this.state.subscribeNL}
              color="primary"
            />
          }
          label="Subscribe to AIFiddle newsletters"
        />

        <Button
          fullWidth={true}
          color="primary"
          loading={isLoading}
          label="Create account"
          className={classes.submit}
          onClick={this.createAccount}
        />

        <div className={classes.signBottomActions}>
          <Typography
            onClick={() => this.props.navigate('/sign-in')}
            className={classes.signBottomActionsAction}
          >
            Already have an account ?
          </Typography>
        </div>
      </form>
    );
  };

  public codeValidationForm = () => {
    const { classes, isLoading, defaultUserName } = this.props;
    const { confirmationCode, username } = this.state;

    return (
      <form className={classes.form} onSubmit={this.confirmCode}>
        {!defaultUserName && (
          <TextField
            name="username"
            onChange={this.updateStateCurried('username')}
            type="text"
            label="Username"
            margin="normal"
            autoFocus={true}
            value={username}
            required={true}
            variant="outlined"
            className={classes.input}
            fullWidth={true}
            id="password"
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete="current-password"
          />
        )}

        <TextField
          name="confirmationCode"
          type="number"
          label="Confrimation code"
          onChange={this.updateStateCurried('confirmationCode')}
          margin="normal"
          variant="outlined"
          required={true}
          className={classes.input}
          fullWidth={true}
          value={confirmationCode}
          id="password"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          fullWidth={true}
          color="primary"
          loading={isLoading}
          label="Validate code"
          className={classes.submit}
          onClick={this.confirmCode}
        />

        <div className={classes.signBottomActions}>
          {/* <Typography
            onClick={() => this.props.navigate('/sign-in')}
            className={classes.signBottomActionsAction}
          >
            resend code
          </Typography> */}
        </div>
      </form>
    );
  };

  public render() {
    const {
      isConfirmationForm,
      defaultUserName,
      classes,
      isLoading,
    } = this.props;
    return (
      <div tabIndex={-1} className={classes.root}>
        <MUIButton
          variant="fab"
          mini={true}
          color="secondary"
          aria-label="Back"
          className={classes.backBtn}
          onClick={() => this.props.navigate('/')}
        >
          <CloseIcon />
        </MUIButton>
        <div className={classes.layout}>
          <Typography variant="h5">AIFiddle</Typography>
          <Paper className={classes.paper}>
            <Typography variant="h6">
              {defaultUserName
                ? 'We sent a code to your email'
                : 'Create an account'}
            </Typography>
            {isConfirmationForm
              ? this.codeValidationForm()
              : this.createAccountForm()}
          </Paper>
        </div>
      </div>
    );
  }
}

const WithTheme = (props: any) => (
  <MuiThemeProvider theme={theme}>
    <SignIn {...props} />
  </MuiThemeProvider>
);

export default WithTheme;
