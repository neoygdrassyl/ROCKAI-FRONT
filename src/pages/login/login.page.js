import { useAuth } from '../../utils/auth.hook.ts';
import { useNavigate  } from "react-router";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
    });
    navigate('/home')
  };


  return (
    <div className="app-login">

      <div className="row p-0 m-0">

        <div className="col-md-6 col-sm-12">

          <div className="container-fluid ">
            
            <div className="row main-content bg-success text-center">
              <div className="col-md-4 text-center company__info">
                <span className="company__logo"><h2><span className="fa fa-android"></span></h2></span>
               <img  src="img/logo-2.png" />
              </div>
              <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
                <div className="container-fluid">
                  <div className="row">
                    <h2>Log In de Aplicación</h2>
                  </div>
                  <div className="row">
                    <form control="" className="form-group">
                      <div className="row">
                        <input type="text" name="username" id="username" className="form__input" placeholder="usuario" />
                      </div>
                      <div className="row">
                        <span className="fa fa-lock"></span>
                        <input type="password" name="password" id="password" className="form__input" placeholder="contraseña" />
                      </div>

                      <div className="row">
                        <div className="col text-center">
                        <button type="submit" className="btn-login" onClick={() => handleLogin()} >Ingresar</button>
                        </div>
                      </div>
                    </form>
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