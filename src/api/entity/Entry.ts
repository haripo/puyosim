import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  history: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;
}