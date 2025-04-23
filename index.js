//  - Balance Final 
//  - Transacción de Mayor Monto
//  - Conteo de Créditos y Débitos
 
const fs = require('fs')
const path = require('path');

// RUTA DEL CSV
const archivo = process.argv[2] || 'data.csv'
const ruta = path.resolve(process.cwd(), archivo);

// PASAR CSV A ARRAY
function leerArchivo(rutaArchivo) {
    let data;

    try {
        data = fs.readFileSync(rutaArchivo, 'utf8');
    }
    catch {
        console.error(`error: noo se encontro "${rutaArchivo}"`);
        process.exit(1)
    }

    const [header, ...filas] = data.trim().split('\n'); // 18,Débito,385.45
    const columnas = header.split(',').map(c => c.trim()); // id,tipo,monto 

    return filas.map(line => {   // 18,Debito,385.45
        const valores = line.split(',').map(v => v.trim()); // [ "18", "Debito", "385.45" ]
        const obj  = {};  

        columnas.forEach ((col, i) => {   // id:0,tipo:1,monto:2 
            obj[col] = valores[i]     // id : 18  ,  tipo: debito  , monto : 385.45
        });

        return { 
          id: Number(obj.id), // 18
          tipo: obj.tipo,       // debito
          monto: Number(obj.monto) // 385.45
        };
    });

}

function procesarLogica(transacciones) {
    let sumaCredito = 0, sumDebito = 0;
    let mayor = { 
        id: null, monto: -Infinity 
    }

    const conteo = { 
        'Crédito': 0, 'Débito': 0 
    };

    for (const t of transacciones) {
     // Si es que no exite pasa este indice
      if (!(t.tipo in conteo)) continue;
     // COntamos cada tarjeta
      conteo[t.tipo]++;
      
      // 
      t.tipo === 'Crédito' ? 
        sumaCredito += t.monto : 
        sumDebito += t.monto;

      if (t.monto > mayor.monto) {
        mayor = { id: t.id, monto: t.monto };
      } 

    }
  
    return { 
      balance: sumaCredito - sumDebito,
      mayor,
      conteo
    };
}


function mostrarInformacion({ balance, mayor, conteo }) {
    console.log("***************************")
    console.log('* Reporte de Transacciones *');
    console.log("**********************************************************")
    console.log(`* Balance Final:             ${balance.toFixed(2)}`);
    console.log(`* Transacción de Mayor Monto: ID ${String(mayor.id).padStart(3)} — ${mayor.monto.toFixed(2)}`);
    console.log(`* Conteo de Transacciones:   Crédito: ${String(conteo['Crédito']).padStart(2)}  Débito: ${String(conteo['Débito']).padStart(2)}`);
    console.log("**********************************************************")
}

const transacciones = leerArchivo(ruta);
const reporte       = procesarLogica(transacciones);
mostrarInformacion(reporte);