import csv

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
