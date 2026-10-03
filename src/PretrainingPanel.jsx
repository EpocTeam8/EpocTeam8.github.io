import { motion } from 'framer-motion';
import pretrainImg from './assets/pretrain_loss.png';

const rise = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' }, transition: { duration: 0.45 } };

const TXT = {
  en: {
    title: 'Self-supervised pretraining check',
    lead: 'Before the model is used on any clinical question, it is pretrained on CT volumes without labels. This figure is a dress rehearsal on MareNostrum 5 (MN5): a 14-subject miniset, 4×H100, 20 epochs. It checks that the training pipeline runs and that the model learns without degenerating. It does not measure clinical performance.',
    figTitle: '3D JEPA pretraining: loss and collapse check',
    alt: 'Two line charts over 20 epochs. Left: pretraining loss falls from 0.45 to 0.26. Right: embedding standard deviation moves between about 0.14 and 0.27 and never reaches zero.',
    lossTitle: 'Pretraining loss',
    loss: 'JEPA (Joint-Embedding Predictive Architecture) hides parts of a 3D scan and trains the model to predict their representation from the visible parts. The loss is the prediction error. It falls from 0.45 to 0.26 (−42%) and flattens around epoch 12, the normal shape of a run that is optimising well.',
    stdTitle: 'Embedding std (collapse check)',
    std: 'Self-supervised models can collapse: the encoder gives nearly the same vector to every scan, so the loss looks great but the representation is useless. Then the embedding std goes to 0. Here it stays between about 0.14 and 0.27 for the whole run, so there is no collapse. It jumps a lot between epochs, which is plausible with so little data, but it shows no downward trend.',
    tag: 'Read with care',
    caveat: 'This is training loss on 14 subjects, with no held-out set. It shows that the pipeline and the objective behave, not that the representation generalises or helps predict COPD. That has to be tested on held-out subjects.',
  },
  es: {
    title: 'Comprobación del preentrenamiento autosupervisado',
    lead: 'Antes de usar el modelo en cualquier pregunta clínica, se preentrena con volúmenes de TC sin etiquetas. Esta figura es un ensayo general en MareNostrum 5 (MN5): un miniconjunto de 14 sujetos, 4×H100, 20 épocas. Comprueba que el pipeline de entrenamiento funciona y que el modelo aprende sin degenerar. No mide rendimiento clínico.',
    figTitle: 'Preentrenamiento JEPA 3D: pérdida y control de colapso',
    alt: 'Dos gráficos de líneas a lo largo de 20 épocas. Izquierda: la pérdida de preentrenamiento baja de 0,45 a 0,26. Derecha: la desviación estándar de los embeddings se mueve entre 0,14 y 0,27 aproximadamente y nunca llega a cero.',
    lossTitle: 'Pérdida de preentrenamiento',
    loss: 'JEPA (Joint-Embedding Predictive Architecture) oculta partes de un escáner 3D y entrena al modelo para predecir su representación a partir de las partes visibles. La pérdida es el error de esa predicción. Baja de 0,45 a 0,26 (−42 %) y se aplana hacia la época 12, la forma normal de un entrenamiento que optimiza bien.',
    stdTitle: 'Desviación estándar de los embeddings (control de colapso)',
    std: 'Los modelos autosupervisados pueden colapsar: el codificador asigna casi el mismo vector a todos los escáneres, así que la pérdida parece excelente pero la representación no sirve. En ese caso la desviación estándar de los embeddings tiende a 0. Aquí se mantiene entre 0,14 y 0,27 aproximadamente durante todo el entrenamiento, así que no hay colapso. Salta mucho entre épocas, algo plausible con tan pocos datos, pero no muestra tendencia a la baja.',
    tag: 'Leer con cautela',
    caveat: 'Es la pérdida de entrenamiento sobre 14 sujetos, sin conjunto de validación. Demuestra que el pipeline y el objetivo se comportan bien, no que la representación generalice ni que ayude a predecir EPOC. Eso hay que comprobarlo con sujetos reservados.',
  },
  ca: {
    title: 'Comprovació del preentrenament autosupervisat',
    lead: 'Abans d\u2019utilitzar el model en cap pregunta clínica, es preentrena amb volums de TC sense etiquetes. Aquesta figura és un assaig general a MareNostrum 5 (MN5): un miniconjunt de 14 subjectes, 4×H100, 20 èpoques. Comprova que el pipeline d\u2019entrenament funciona i que el model aprèn sense degenerar. No mesura rendiment clínic.',
    figTitle: 'Preentrenament JEPA 3D: pèrdua i control de col·lapse',
    alt: 'Dos gràfics de línies al llarg de 20 èpoques. Esquerra: la pèrdua de preentrenament baixa de 0,45 a 0,26. Dreta: la desviació estàndard dels embeddings es mou entre 0,14 i 0,27 aproximadament i mai arriba a zero.',
    lossTitle: 'Pèrdua de preentrenament',
    loss: 'JEPA (Joint-Embedding Predictive Architecture) amaga parts d\u2019un escàner 3D i entrena el model perquè predigui la seva representació a partir de les parts visibles. La pèrdua és l\u2019error d\u2019aquesta predicció. Baixa de 0,45 a 0,26 (−42 %) i s\u2019aplana cap a l\u2019època 12, la forma normal d\u2019un entrenament que optimitza bé.',
    stdTitle: 'Desviació estàndard dels embeddings (control de col·lapse)',
    std: 'Els models autosupervisats poden col·lapsar: l\u2019encoder assigna gairebé el mateix vector a tots els escàners, de manera que la pèrdua sembla excel·lent però la representació no serveix. En aquest cas la desviació estàndard dels embeddings tendeix a 0. Aquí es manté entre 0,14 i 0,27 aproximadament durant tot l\u2019entrenament, així que no hi ha col·lapse. Salta molt entre èpoques, cosa plausible amb tan poques dades, però no mostra tendència a la baixa.',
    tag: 'Llegir amb cautela',
    caveat: 'És la pèrdua d\u2019entrenament sobre 14 subjectes, sense conjunt de validació. Demostra que el pipeline i l\u2019objectiu es comporten bé, no que la representació generalitzi ni que ajudi a predir MPOC. Això s\u2019ha de comprovar amb subjectes reservats.',
  },
};

export default function PretrainingPanel({ lang = 'en' }) {
  const x = TXT[lang] || TXT.en;
  return (
    <motion.section id="pretraining" className="glass content-panel" {...rise}>
      <div className="section-heading">
        <div className="eyebrow"></div>
        <h2>{x.title}</h2>
        <p>{x.lead}</p>
      </div>

      <div className="chart-panel mt-4">
        <h3>{x.figTitle}</h3>
        <img
          src={pretrainImg}
          alt={x.alt}
          loading="lazy"
          className="w-100 mt-2"
          style={{ height: 'auto', background: '#fff', borderRadius: 12, padding: 8 }}
        />
      </div>

      <div className="row g-3 mt-0">
        <div className="col-12 col-md-6">
          <div className="chart-panel h-100 mt-0">
            <h3>{x.lossTitle}</h3>
            <p className="mb-0">{x.loss}</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="chart-panel h-100 mt-0">
            <h3>{x.stdTitle}</h3>
            <p className="mb-0">{x.std}</p>
          </div>
        </div>
      </div>

      <div className="bridge-highlight mt-3">
        <span className="tag">{x.tag}</span>
        <p>{x.caveat}</p>
      </div>
    </motion.section>
  );
}