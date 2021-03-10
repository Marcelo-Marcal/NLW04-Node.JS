import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("surveys")
class Survey {
//Definir os atributos
  @PrimaryColumn()
  readonly id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  //Se esse id ñ existir, o valor será uuid
  constructor() {
    if(!this.id) {
      this.id = uuid();
    }    
  }
}

export { Survey }