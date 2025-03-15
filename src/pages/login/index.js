import { useTranslation } from 'react-i18next';
import SystemService from '../../services/system.service.js';
import { useNavigate } from "react-router";
import { useContext, useState } from 'react';
import { AuthContext } from '../../utils/context/auth.context.ts';
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userContext = useContext(AuthContext)
  const toastNotification = () => toast.error(t('login.error'));

  const handleLogin = async () => {
    setLoading(true)
    const data = {
      'login': document.getElementById('rockai-user').value,
      'pass': document.getElementById('rockai-pass').value
    }
    await SystemService.app_login(data)
      .then(req => {
        userContext.login(req.data)
        navigate("/home")
      })
      .catch(async (err) => {
        console.error(err);
        toastNotification();
      })
      .finally(() => setLoading(false))
  };

  return (
    <div className="app-login">
      <ToastContainer position="top-left" autoClose={7000} theme="colored"/>
      <div className="row p-0 m-0">
        <div className="col-md-6 col-sm-12">
          <div className="container-fluid ">
            <div className="row main-content bg-success text-center">
              <div className="col-md-4 text-center company__info">
                <span className="company__logo"><h2><span className="fa fa-android"></span></h2></span>
                <img src="img/logo-2.png" />
              </div>
              <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
                <div className="container-fluid">
                  <div className="row">
                    <h2>{t('login.title')}</h2>
                  </div>
                  <div className="row">
                    <div control="" className="form-group">
                      <div className="row">
                        <input type="text" name="rockai-user" id="rockai-user" className="form__input" placeholder={t('login.user')} />
                      </div>
                      <div className="row">
                        <span className="fa fa-lock"></span>
                        <input type="password" name="rockai-pass" id="rockai-pass" className="form__input" placeholder={t('login.pass')} />
                      </div>

                      <div className="row">
                        <div className="col text-center">
                          <button type="submit" className="btn-login" onClick={() => handleLogin()} disabled={isLoading}>
                            {isLoading ? <>
                              <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true"></span> {t('login.loading')}
                            </> : t('login.btn')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}