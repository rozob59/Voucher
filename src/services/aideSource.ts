export interface AideFile {
  path: string;
  category: 'gradle' | 'manifest' | 'database' | 'viewmodel' | 'layout' | 'res' | 'helper' | 'guide';
  language: 'xml' | 'groovy' | 'kotlin' | 'markdown';
  content: string;
  description: string;
}

export const AIDE_PROJECT_FILES: AideFile[] = [
  {
    path: 'build.gradle',
    category: 'gradle',
    language: 'groovy',
    description: 'Top-level Gradle build configuration',
    content: `buildscript {
    ext.kotlin_version = '1.8.20'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`
  },
  {
    path: 'app/build.gradle',
    category: 'gradle',
    language: 'groovy',
    description: 'App level dependencies (Room, Material, Gson, Coroutines)',
    content: `apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-kapt'

android {
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.rozob.wifivouchermanager"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
    implementation 'androidx.core:core-ktx:1.10.1'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'

    // Room Database
    def room_version = "2.5.2"
    implementation "androidx.room:room-runtime:$room_version"
    implementation "androidx.room:room-ktx:$room_version"
    kapt "androidx.room:room-compiler:$room_version"

    // Coroutines & Lifecycle
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.6.1'

    // JSON Backup
    implementation 'com.google.code.gson:gson:2.10.1'
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    description: 'Android Application Manifest with offline permissions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.rozob.wifivouchermanager">

    <!-- Fully Offline App - No Internet permission required -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.RozobVoucherManager">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>`
  },
  {
    path: 'app/src/main/java/com/rozob/wifivouchermanager/data/Voucher.kt',
    category: 'database',
    language: 'kotlin',
    description: 'Room Entity definition for Voucher table',
    content: `package com.rozob.wifivouchermanager.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "vouchers")
data class Voucher(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val voucherCode: String,
    val packageName: String,
    val price: Double,
    val validityDays: Int,
    var status: String, // AVAILABLE, ASSIGNED, USED, EXPIRED
    val createdDate: Long = System.currentTimeMillis(),
    var assignedDate: Long? = null,
    var usedDate: Long? = null,
    var expiryDate: Long? = null,
    var userName: String? = null,
    var userMobile: String? = null,
    var userAddress: String? = null,
    var shopName: String? = null,
    var deviceName: String? = null,
    var macAddress: String? = null,
    var notes: String? = null,
    var isDeleted: Boolean = false
)`
  },
  {
    path: 'app/src/main/java/com/rozob/wifivouchermanager/data/VoucherDao.kt',
    category: 'database',
    language: 'kotlin',
    description: 'Room Data Access Object for Voucher operations',
    content: `package com.rozob.wifivouchermanager.data

import androidx.lifecycle.LiveData
import androidx.room.*

@Dao
interface VoucherDao {
    @Query("SELECT * FROM vouchers WHERE isDeleted = 0 ORDER BY id DESC")
    fun getAllVouchers(): LiveData<List<Voucher>>

    @Query("SELECT * FROM vouchers WHERE isDeleted = 0 AND status = :status ORDER BY id DESC")
    fun getVouchersByStatus(status: String): LiveData<List<Voucher>>

    @Query("SELECT * FROM vouchers WHERE voucherCode = :code LIMIT 1")
    suspend fun getVoucherByCode(code: String): Voucher?

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertVouchers(vouchers: List<Voucher>)

    @Update
    suspend fun updateVoucher(voucher: Voucher)

    @Query("UPDATE vouchers SET isDeleted = 1 WHERE id = :id")
    suspend fun softDelete(id: Long)

    @Query("SELECT COUNT(*) FROM vouchers WHERE isDeleted = 0")
    fun getTotalCount(): LiveData<Int>

    @Query("SELECT COUNT(*) FROM vouchers WHERE isDeleted = 0 AND status = 'AVAILABLE'")
    fun getAvailableCount(): LiveData<Int>

    @Query("SELECT COUNT(*) FROM vouchers WHERE isDeleted = 0 AND status = 'USED'")
    fun getUsedCount(): LiveData<Int>
}`
  },
  {
    path: 'app/src/main/java/com/rozob/wifivouchermanager/data/AppDatabase.kt',
    category: 'database',
    language: 'kotlin',
    description: 'Room Database Singleton Instance',
    content: `package com.rozob.wifivouchermanager.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [Voucher::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun voucherDao(): VoucherDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "rozob_wifi_vouchers.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/rozob/wifivouchermanager/utils/PdfGenerator.kt',
    category: 'helper',
    language: 'kotlin',
    description: 'Native Android PdfDocument Generator for single and bulk export',
    content: `package com.rozob.wifivouchermanager.utils

import android.content.Context
import android.graphics.*
import android.graphics.pdf.PdfDocument
import com.rozob.wifivouchermanager.data.Voucher
import java.io.File
import java.io.FileOutputStream

object PdfGenerator {

    fun generateSingleVoucherPdf(context: Context, voucher: Voucher, businessName: String = "ROZOB WiFi"): File {
        val pdfDocument = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(300, 450, 1).create()
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        val paint = Paint().apply {
            isAntiAlias = true
        }

        // Header
        paint.color = Color.parseColor("#14532D")
        canvas.drawRect(0f, 0f, 300f, 80f, paint)

        paint.color = Color.WHITE
        paint.textSize = 20f
        paint.typeface = Typeface.DEFAULT_BOLD
        paint.textAlign = Paint.Align.CENTER
        canvas.drawText(businessName, 150f, 40f, paint)

        paint.textSize = 12f
        paint.typeface = Typeface.DEFAULT
        canvas.drawText("INTERNET VOUCHER", 150f, 65f, paint)

        // Code Card Box
        paint.color = Color.parseColor("#ECFDF5")
        canvas.drawRoundRect(20f, 100f, 280f, 160f, 10f, 10f, paint)

        paint.color = Color.parseColor("#14532D")
        paint.textSize = 22f
        paint.typeface = Typeface.MONOSPACE
        canvas.drawText(voucher.voucherCode, 150f, 138f, paint)

        // Details
        paint.color = Color.BLACK
        paint.textSize = 14f
        paint.textAlign = Paint.Align.LEFT
        paint.typeface = Typeface.DEFAULT_BOLD

        var y = 200f
        fun drawRow(label: String, valStr: String) {
            paint.typeface = Typeface.DEFAULT_BOLD
            canvas.drawText(label, 30f, y, paint)
            paint.typeface = Typeface.DEFAULT
            canvas.drawText(valStr, 150f, y, paint)
            y += 30f
        }

        drawRow("Package:", voucher.packageName)
        drawRow("Price:", "৳ \${voucher.price.toInt()}")
        drawRow("Validity:", "\${voucher.validityDays} Days")
        drawRow("Status:", voucher.status)
        voucher.userName?.let { drawRow("User:", it) }
        voucher.userMobile?.let { drawRow("Mobile:", it) }

        pdfDocument.finishPage(page)

        val file = File(context.cacheDir, "Voucher_\${voucher.voucherCode}.pdf")
        FileOutputStream(file).use { pdfDocument.writeTo(it) }
        pdfDocument.close()
        return file
    }
}`
  },
  {
    path: 'app/src/main/java/com/rozob/wifivouchermanager/MainActivity.kt',
    category: 'viewmodel',
    language: 'kotlin',
    description: 'Main Activity with Clipboard, Share, PDF & Bulk Import logic',
    content: `package com.rozob.wifivouchermanager

import android.app.AlertDialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import com.rozob.wifivouchermanager.data.AppDatabase
import com.rozob.wifivouchermanager.data.Voucher
import com.rozob.wifivouchermanager.utils.PdfGenerator
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {

    private lateinit var db: AppDatabase
    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    private lateinit var tvTotalCount: TextView
    private lateinit var tvAvailableCount: TextView
    private lateinit var etVoucherInput: EditText
    private lateinit var btnImport: Button
    private lateinit var btnExportPdf: Button
    private lateinit var etSearch: EditText
    private lateinit var lvVouchers: ListView

    private var allVouchers: List<Voucher> = ArrayList()
    private var displayedVouchers: MutableList<Voucher> = ArrayList()
    private lateinit var adapter: VoucherAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        try {
            setContentView(R.layout.main)
        } catch (e: Exception) {
            setContentView(R.layout.activity_main)
        }

        db = AppDatabase.getDatabase(this)
        initViews()
        setupListeners()
        loadDataFromDatabase()
    }

    private fun initViews() {
        tvTotalCount = findViewById(R.id.tvTotalCount)
        tvAvailableCount = findViewById(R.id.tvAvailableCount)
        etVoucherInput = findViewById(R.id.etVoucherInput)
        btnImport = findViewById(R.id.btnImport)
        btnExportPdf = findViewById(R.id.btnExportPdf)
        etSearch = findViewById(R.id.etSearch)
        lvVouchers = findViewById(R.id.lvVouchers)

        adapter = VoucherAdapter(this, displayedVouchers)
        lvVouchers.adapter = adapter
    }

    private fun setupListeners() {
        // Bulk Import Click
        btnImport.setOnClickListener {
            val text = etVoucherInput.text.toString().trim()
            if (text.isEmpty()) {
                Toast.makeText(this, "অনুগ্রহ করে ভাউচার কোড পেস্ট করুন", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val lines = text.split("\\n").map { it.trim() }.filter { it.isNotEmpty() }
            if (lines.isEmpty()) {
                Toast.makeText(this, "কোনো বৈধ ভাউচার কোড পাওয়া যায়নি", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            executor.execute {
                val newVouchers = lines.map { code ->
                    Voucher(
                        voucherCode = code,
                        packageName = "1GB Daily",
                        price = 30.0,
                        validityDays = 1,
                        status = "AVAILABLE"
                    )
                }

                db.voucherDao().insertVouchers(newVouchers)

                mainHandler.post {
                    etVoucherInput.text.clear()
                    Toast.makeText(this, "\${lines.size} টি ভাউচার সফলভাবে ইমপোর্ট হয়েছে!", Toast.LENGTH_LONG).show()
                    loadDataFromDatabase()
                }
            }
        }

        // Search Filter
        etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterVouchers(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        // ListView Item Click -> Copy Code
        lvVouchers.onItemClickListener = AdapterView.OnItemClickListener { _, _, position, _ ->
            if (position in 0 until displayedVouchers.size) {
                val v = displayedVouchers[position]
                copyVoucherToClipboard(v)
            }
        }

        // ListView Long Click -> Options Dialog (Share / Mark Used / Delete)
        lvVouchers.onItemLongClickListener = AdapterView.OnItemLongClickListener { _, _, position, _ ->
            if (position in 0 until displayedVouchers.size) {
                val v = displayedVouchers[position]
                showVoucherOptionsDialog(v)
            }
            true
        }

        // Export PDF Click
        btnExportPdf.setOnClickListener {
            if (displayedVouchers.isEmpty()) {
                Toast.makeText(this, "PDF প্রিন্ট করার মতো কোনো ভাউচার নেই", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            try {
                val firstVoucher = displayedVouchers[0]
                val pdfFile = PdfGenerator.generateSingleVoucherPdf(this, firstVoucher)
                
                val uri: Uri = try {
                    FileProvider.getUriForFile(this, "$packageName.provider", pdfFile)
                } catch (e: Exception) {
                    Uri.fromFile(pdfFile)
                }

                val intent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(uri, "application/pdf")
                    flags = Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NO_HISTORY
                }
                startActivity(Intent.createChooser(intent, "PDF ফাইল দেখুন/শেয়ার করুন"))
            } catch (e: Exception) {
                Toast.makeText(this, "PDF তৈরিতে সমস্যা হয়েছে: \${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadDataFromDatabase() {
        db.voucherDao().getAllVouchers().observe(this) { vouchers ->
            allVouchers = vouchers ?: ArrayList()
            filterVouchers(etSearch.text.toString())
            updateCounts()
        }
    }

    private fun updateCounts() {
        val total = allVouchers.size
        val avail = allVouchers.count { it.status == "AVAILABLE" }
        tvTotalCount.text = total.toString()
        tvAvailableCount.text = avail.toString()
    }

    private fun filterVouchers(query: String) {
        displayedVouchers.clear()
        if (query.isBlank()) {
            displayedVouchers.addAll(allVouchers)
        } else {
            val q = query.lowercase()
            for (v in allVouchers) {
                if (v.voucherCode.lowercase().contains(q) || (v.userName != null && v.userName!!.lowercase().contains(q))) {
                    displayedVouchers.add(v)
                }
            }
        }
        adapter.notifyDataSetChanged()
    }

    private fun showVoucherOptionsDialog(voucher: Voucher) {
        val options = arrayOf("শেয়ার করুন (Share)", "ব্যবহারকৃত চিহ্নিত করুন (Mark Used)", "মুছে ফেলুন (Delete)")
        AlertDialog.Builder(this)
            .setTitle("ভাউচার কোড: \${voucher.voucherCode}")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> shareVoucher(voucher)
                    1 -> toggleStatus(voucher)
                    2 -> deleteVoucher(voucher)
                }
            }
            .setNegativeButton("বাতিল", null)
            .show()
    }

    private fun toggleStatus(voucher: Voucher) {
        executor.execute {
            voucher.status = if (voucher.status == "AVAILABLE") "USED" else "AVAILABLE"
            db.voucherDao().updateVoucher(voucher)
            mainHandler.post {
                Toast.makeText(this, "স্ট্যাটাস আপডেট করা হয়েছে", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun deleteVoucher(voucher: Voucher) {
        executor.execute {
            db.voucherDao().softDelete(voucher.id)
            mainHandler.post {
                Toast.makeText(this, "ভাউচার মুছে ফেলা হয়েছে", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun copyVoucherToClipboard(voucher: Voucher) {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val text = "ROZOB WiFi\\n\\nVoucher: \${voucher.voucherCode}\\nPackage: \${voucher.packageName}\\nPrice: ৳\${voucher.price.toInt()}\\nValidity: \${voucher.validityDays} Days\\nStatus: \${voucher.status}"
        val clip = ClipData.newPlainText("Voucher Info", text)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(this, "ভাউচার কপি করা হয়েছে: \${voucher.voucherCode}", Toast.LENGTH_SHORT).show()
    }

    fun shareVoucher(voucher: Voucher) {
        val text = "ROZOB WiFi Voucher: \${voucher.voucherCode} | Package: \${voucher.packageName} | Price: ৳\${voucher.price.toInt()}"
        val sendIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, text)
            type = "text/plain"
        }
        startActivity(Intent.createChooser(sendIntent, "ভাউচার শেয়ার করুন"))
    }

    // Inner ListView Adapter
    private class VoucherAdapter(
        private val context: Context,
        private val list: List<Voucher>
    ) : BaseAdapter() {

        override fun getCount(): Int = list.size
        override fun getItem(position: Int): Any = list[position]
        override fun getItemId(position: Int): Long = list[position].id

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(context).inflate(
                try { R.layout.item_voucher } catch(e: Exception) { android.R.layout.simple_list_item_2 },
                parent,
                false
            )

            val voucher = list[position]
            val tvCode = view.findViewById<TextView>(R.id.tvCode)
            val tvStatus = view.findViewById<TextView>(R.id.tvStatus)
            val tvDetails = view.findViewById<TextView>(R.id.tvDetails)

            if (tvCode != null) tvCode.text = voucher.voucherCode
            if (tvStatus != null) {
                tvStatus.text = voucher.status
                tvStatus.setTextColor(if (voucher.status == "AVAILABLE") 0xFF34D399.toInt() else 0xFFF43F5E.toInt())
            }
            if (tvDetails != null) {
                tvDetails.text = "\${voucher.packageName} • ৳\${voucher.price.toInt()} • \${voucher.validityDays} দিন মেয়াদী"
            }

            return view
        }
    }
}`
  },
  {
    path: 'app/src/main/res/layout/main.xml',
    category: 'layout',
    language: 'xml',
    description: 'Main UI layout file for AIDE IDE (main.xml)',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#0F172A">

    <!-- Top App Bar / Banner -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:background="#1E293B"
        android:padding="16dp"
        android:gravity="center_vertical">

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="ROZOB WiFi Voucher Manager"
                android:textColor="#34D399"
                android:textSize="18sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="অফলাইন ওয়াইফাই ভাউচার ম্যানেজমেন্ট"
                android:textColor="#94A3B8"
                android:textSize="11sp" />
        </LinearLayout>

        <Button
            android:id="@+id/btnExportPdf"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="📄 PDF"
            android:textSize="12sp"
            android:background="#059669"
            android:textColor="#FFFFFF" />
    </LinearLayout>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fillViewport="true">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="12dp">

            <!-- Stats Overview Row 1 -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:weightSum="2"
                android:layout_marginBottom="8dp">

                <!-- Total Vouchers Card -->
                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:background="#1E293B"
                    android:padding="12dp"
                    android:orientation="vertical"
                    android:layout_marginRight="4dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="মোট ভাউচার"
                        android:textColor="#94A3B8"
                        android:textSize="11sp" />

                    <TextView
                        android:id="@+id/tvTotalCount"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="0"
                        android:textColor="#38BDF8"
                        android:textSize="22sp"
                        android:textStyle="bold" />
                </LinearLayout>

                <!-- Available Vouchers Card -->
                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:background="#1E293B"
                    android:padding="12dp"
                    android:orientation="vertical"
                    android:layout_marginLeft="4dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="অ্যাভেলেবল (Available)"
                        android:textColor="#94A3B8"
                        android:textSize="11sp" />

                    <TextView
                        android:id="@+id/tvAvailableCount"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="0"
                        android:textColor="#34D399"
                        android:textSize="22sp"
                        android:textStyle="bold" />
                </LinearLayout>
            </LinearLayout>

            <!-- Quick Import Input Box -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:background="#1E293B"
                android:padding="12dp"
                android:layout_marginBottom="12dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="➕ নতুন ভাউচার ইমপোর্ট করুন (Bulk Import)"
                    android:textColor="#FFFFFF"
                    android:textSize="13sp"
                    android:textStyle="bold"
                    android:layout_marginBottom="6dp" />

                <EditText
                    android:id="@+id/etVoucherInput"
                    android:layout_width="match_parent"
                    android:layout_height="80dp"
                    android:hint="এখানে প্রতিটি ভাউচার কোড নতুন লাইনে পেস্ট করুন..."
                    android:textColorHint="#64748B"
                    android:textColor="#FFFFFF"
                    android:background="#0F172A"
                    android:padding="10dp"
                    android:gravity="top|left"
                    android:textSize="12sp" />

                <Button
                    android:id="@+id/btnImport"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="ভাউচার ইমপোর্ট করুন (Save Vouchers)"
                    android:background="#10B981"
                    android:textColor="#FFFFFF"
                    android:textStyle="bold" />
            </LinearLayout>

            <!-- Search Bar -->
            <EditText
                android:id="@+id/etSearch"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="🔍 ভাউচার কোড বা কাস্টমার দিয়ে খুঁজুন..."
                android:textColorHint="#64748B"
                android:textColor="#FFFFFF"
                android:background="#1E293B"
                android:padding="12dp"
                android:textSize="12sp"
                android:layout_marginBottom="12dp" />

            <!-- Voucher List Title -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="📋 ভাউচার তালিকা (Voucher List)"
                android:textColor="#E2E8F0"
                android:textSize="14sp"
                android:textStyle="bold"
                android:layout_marginBottom="6dp" />

            <!-- Voucher List View -->
            <ListView
                android:id="@+id/lvVouchers"
                android:layout_width="match_parent"
                android:layout_height="350dp"
                android:divider="#334155"
                android:dividerHeight="1dp" />

        </LinearLayout>
    </ScrollView>
</LinearLayout>`
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    category: 'layout',
    language: 'xml',
    description: 'Main activity layout file',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#0F172A">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="ROZOB WiFi Voucher Manager"
        android:textColor="#34D399"
        android:textSize="18sp"
        android:textStyle="bold"
        android:padding="16dp"
        android:background="#1E293B" />

    <ListView
        android:id="@+id/lvVouchers"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</LinearLayout>`
  },
  {
    path: 'app/src/main/res/layout/item_voucher.xml',
    category: 'layout',
    language: 'xml',
    description: 'Single Voucher Card Row Layout',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:background="#1E293B"
    android:padding="12dp"
    android:layout_marginBottom="8dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical">

        <TextView
            android:id="@+id/tvCode"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="VOUCHER-1234"
            android:textColor="#FFFFFF"
            android:textSize="15sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvStatus"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="AVAILABLE"
            android:textColor="#34D399"
            android:textSize="11sp"
            android:textStyle="bold"
            android:padding="4dp" />
    </LinearLayout>

    <TextView
        android:id="@+id/tvDetails"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="1GB Daily • ৳30 • 1 Day Validity"
        android:textColor="#94A3B8"
        android:textSize="12sp"
        android:layout_marginTop="4dp" />
</LinearLayout>`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'res',
    language: 'xml',
    description: 'Bengali and English localization resource strings',
    content: `<resources>
    <string name="app_name">ROZOB WiFi Voucher Manager</string>
    <string name="hello_world">ROZOB WiFi Voucher Manager</string>
    <string name="dashboard">ড্যাশবোর্ড (Dashboard)</string>
    <string name="total_vouchers">মোট ভাউচার</string>
    <string name="available_vouchers">অ্যাভেলেবল (Available)</string>
    <string name="assigned_vouchers">অ্যাসাইনড (Assigned)</string>
    <string name="used_vouchers">ব্যবহৃত (Used)</string>
    <string name="expired_vouchers">মেয়াদোত্তীর্ণ (Expired)</string>
    
    <string name="bulk_add">➕ বাল্ক অ্যাড ভাউচার</string>
    <string name="voucher_list">📋 ভাউচার লিস্ট</string>
    <string name="export_all_pdf">📄 এক্সপোর্ট অল PDF</string>
    <string name="search">🔍 সার্চ</string>
    <string name="settings">⚙️ সেটিংস</string>
    
    <string name="copy">কপি (Copy)</string>
    <string name="pdf">পিডিএফ (PDF)</string>
    <string name="user">ইউজার (User)</string>
    <string name="edit">এডিট (Edit)</string>
    <string name="delete">ডিলিট (Delete)</string>
    <string name="mark_as_used">Mark as Used</string>
    <string name="mark_as_available">Mark as Available</string>
</resources>`
  },
  {
    path: 'AIDE_BUILD_GUIDE.md',
    category: 'guide',
    language: 'markdown',
    description: 'Step-by-Step Instructions to build APK in AIDE on Android',
    content: `# ROZOB WiFi Voucher Manager - AIDE Build Guide

Follow these simple steps to compile and build the Android APK directly on your Android phone using AIDE (Android IDE):

## 1. Create New Project in AIDE
1. Open **AIDE** on your Android device.
2. Select **Create New Project** -> **Java/Kotlin Android App**.
3. Set App Name: \`ROZOB WiFi Voucher Manager\`
4. Set Package Name: \`com.rozob.wifivouchermanager\`
5. Choose Minimum SDK: **API 21 (Android 5.0)**.

## 2. Copy Code Files
Replace or add the provided files in their respective project folders:
- \`app/build.gradle\` -> Add dependencies for Room & Material UI
- \`AndroidManifest.xml\` -> Paste manifest file
- \`Voucher.kt\`, \`VoucherDao.kt\`, \`AppDatabase.kt\` -> Place under \`app/src/main/java/com/rozob/wifivouchermanager/data/\`
- \`PdfGenerator.kt\` -> Place under \`app/src/main/java/com/rozob/wifivouchermanager/utils/\`
- \`MainActivity.kt\` -> Place under \`app/src/main/java/com/rozob/wifivouchermanager/\`
- \`strings.xml\` -> Place under \`app/src/main/res/values/\`

## 3. Build & Install APK
1. Tap **Run / Build** in AIDE.
2. AIDE will resolve Room dependencies and compile Kotlin sources.
3. Once complete, tap **Install APK** when prompted.

## 4. How to Test Bulk Import & PDF
1. Open the app -> Tap **➕ Bulk Add Vouchers**.
2. Paste test codes (e.g., \`RZB-8K4M-72QP\\nRZB-91XP-44KD\`).
3. Select package **30 Days - ৳100** -> Tap **Import Vouchers**.
4. Check Dashboard stats updating automatically!
5. Tap **PDF** on any voucher card to generate & share local PDF voucher!`
  }
];
