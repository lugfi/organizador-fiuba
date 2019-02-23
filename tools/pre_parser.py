import csv
import pandas as pd
from tabula import read_pdf

CUATRI = '1Q2019'
INPUT_FILE = 'oferta_2019.csv'
OUTPUT_FILE = f"Horarios_{CUATRI}.txt"
total = 4404 # Supongo que es el número total de materias desde que empezó el organizador

class Curso():
    def __init__(self, materia, curso, nombre, docentes, dia, inicio, fin, sede, vacantes, carreras):
        self.materia = materia
        self.curso = curso
        self.nombre = nombre
        self.docentes = docentes
        self.dia = self.filtrar_dia(dia)
        self.inicio = inicio
        self.fin = fin
        self.sede = sede
        self.vacantes = vacantes
        self.carreras = carreras

    def filtrar_dia(self, dia):
        return {
            'L': 'Lunes',
            'Ma': 'Martes',
            'Mi': 'Miércoles',
            'J': 'Jueves',
            'V': 'Viernes',
            'S': 'Sábado',
            'D': 'Domingo' # ?!?
        }[dia]
    
    def print_ficha(self):
        print(f"Materia: {self.materia} {self.nombre} Vacantes: {self.vacantes}", file=outfile)
        print(f"Docente: {self.docentes}", file=outfile)
        print(f"Carreras: {self.carreras}", file=outfile) # NOTE: No sé de donde sacar esta info
        print(f"Curso: {self.curso}", file=outfile)
        self.print_horario()

    def print_header(self):
        print(f"\"{total}\";\"{CUATRI}\";\"{self.nombre} \";\"{self.materia}\";\"", file=outfile)

    def print_horario(self):
        print(f"{self.dia} {self.inicio} {self.fin} Teórica/Práctica Aula:{self.sede}-000", file=outfile)
        # NOTE: El aula y si es teo/prac no estaba en el pdf

def parse_pdf(path):
    cols = ["Materia", "Curso", "Nombre", "Docentes", "Día", "Inicio", "Fin", "Sede", "Vacantes"]

    dfr = read_pdf(path,
                   stream=True, 
                   guess=False,
                   area=[[82, 13.4, 795.38, 581.8],[42.93, 14.39, 42.93+753.51, 14.39+567.8]],
                   columns=[14.39,46.94,68.05,197.33,451.53,475.29,
                           499.52,524.23,556.55])
    for c in dfr.columns:
        if "Unnamed" in c: dfr.drop(c, axis=1)
    dfr.columns = cols
    new_path = path.rstrip('pdf')+'csv'
    dfr.to_csv(new_path, index=False)
    return new_path

if __name__ == "__main__":
    print(f"Parseando {INPUT_FILE}...")
    with open(INPUT_FILE, 'r') as infile, open(OUTPUT_FILE, "w") as outfile:
        infile_reader = csv.reader(infile, delimiter=',')

        # Leo primer linea
        primero = next(infile_reader) 
        curso_ant = Curso(*primero)
        curso_ant.print_header()
        curso_ant.print_ficha()
        total += 1

        for fila in infile_reader:
            curso = Curso(*fila)
            # Comparo la linea actual con la anterior
            if curso_ant.materia == curso.materia:
                if curso_ant.curso == curso.curso:
                    curso.print_horario()
                else:
                    print(file=outfile)
                    curso.print_ficha()
            else:
                print("\n\"", file=outfile)
                curso.print_header()
                curso.print_ficha()
                total += 1
            curso_ant = curso
        print("\n\"", file=outfile)
    print(f"Listo!\nCreado {OUTPUT_FILE}")
