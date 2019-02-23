from tabula import read_pdf
from functools import partial
import argparse
import logging
from datetime import datetime as dt

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def parse_pdf(path, cuatri, indice, out):
    cols = ["Materia", "Curso", "Nombre", "Docentes", "Día", "Inicio", "Fin", "Sede", "Vacantes"]

    dfr = read_pdf(path,
                   stream=True,
                   guess=False,
                   pages='all',
                   area=[[82, 14.39, 795.38, 581.8], [42.93, 14.39, 796.43, 581.8]],
                   columns=[14.39, 46.94, 68.05, 197.33, 451.53, 475.29, 499.52, 524.23, 556.55])
    dfr = dfr.drop([col for col in dfr.columns if "Unnamed" in col], axis=1)
    dfr.columns = cols

    DIAS = {
        'L': 'Lunes',
        'Ma': 'Martes',
        'Mi': 'Miércoles',
        'J': 'Jueves',
        'V': 'Viernes',
        'S': 'Sábados'
    }
    dfr['Día'] = dfr['Día'].apply(lambda x: str(x).strip()).apply(DIAS.get)

    dfr = dfr.drop(dfr[~dfr.Materia.str.isdigit()].index)

    cols_horarios = ["Día", "Inicio", "Fin", "Sede"]
    dfr['Horarios'] = dfr[cols_horarios].apply(lambda x: ' '.join(map(str, x)), axis=1)
    dfr = dfr.drop(cols_horarios, axis=1)

    def tjoin(x, s):
        try:
            return s.join(set(x))
        except:
            return 'Sin especificar'

    dfr = dfr.groupby(["Materia", "Curso"]).agg({
        'Nombre': lambda x: list(x)[0],
        'Docentes': partial(tjoin, s='-'),
        'Vacantes': lambda x: list(x)[0],
        'Horarios': partial(tjoin, s="\n"),
    }).reset_index()
    dfr['Cuatri'] = cuatri
    dfr['Indice'] = dfr.index + indice

    dfr = dfr[['Indice', 'Cuatri', 'Nombre', 'Materia', 'Horarios']]

    dfr.to_csv(out, index=False)


def armar_cuatri():
    hoy = dt.today()
    return f"{(hoy.month // 6) + 1}Q{hoy.year}"  # discutible, pero meh


if __name__ == "__main__":
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--pdf', required=True, help='archivo pdf a parsear')
    parser.add_argument('--salida', help='nombre del archivo de salida. Se toma OfertaHoraria-<cuatrimestre>.csv como default.', default=None)
    parser.add_argument('--cuatri', help='cuatri en formato {1,2}QYYYYY', default=armar_cuatri())
    parser.add_argument('--indice', help='indice de inicio de las materias', default=0)
    args = parser.parse_args()

    if args.salida is None:
        args.salida = f"OfertaHoraria-{args.cuatri}.csv"

    logger.info(f"parseando pdf {args.pdf}")
    logger.info(f"la salida se guardará en {args.salida}, con indice {args.indice} para el cuatri {args.cuatri}")
    parse_pdf(args.pdf, args.cuatri, args.indice, args.salida)
