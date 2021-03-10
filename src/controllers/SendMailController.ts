import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    //Verificar se usuario existe pelo email
    const user = await usersRepository.findOne({ email });

    //Se o usuario não existe dar um error
    if(!user) {
      throw new AppError("User does not exists");    
    }
    //Se existe
    const survey = await surveysRepository.findOne({
      id: survey_id,
    });
    //Se a pesquisa não existe
    if(!survey) {
      throw new AppError("Survey does not exists!");    
    }
    
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    //Se existe uma pesquisa com nulo, que retorne para mim
    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      //Faça uma busca dentro da tabela user
      where: {user_id: user.id, value : null},
      relations: ["user", "survey"],
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    };

    //Ai se existi sera criado so uma vez
    if(surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists);
    }

    //Salvar as informações na tabela surveyUser
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });
    
    await surveysUsersRepository.save(surveyUser);
    variables.id = surveyUser.id;
    
    await SendMailService.execute(email, survey.title, variables, npsPath);

    //Enviar email para o usuario
    return response.json(surveyUser);

  }  
}

export { SendMailController };

